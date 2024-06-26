const debug = require('debug')
const log = debug('tracing-middleware')
const opentelemetry = require('@opentelemetry/api')
const { NodeTracerProvider } = require('@opentelemetry/node')
const { Resource } = require('@opentelemetry/resources')
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')
const { registerInstrumentations } = require('@opentelemetry/instrumentation')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')
const { BatchSpanProcessor } = require('@opentelemetry/tracing')

module.exports = function (config, instrumentations) {
    // Enable OpenTelemetry exporters to export traces to Grafan Tempo.

    const tracerProvider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
            // import to make the feature "logs to trace" working
            // Loki has only the field "app"
            app: config.serviceName
        })
    })

    // Initialize the exporter
    const options = {
        url: config.exporterEndpoint
    }

    /**
     *
     * Configure the span processor to send spans to the exporter
     * The SimpleSpanProcessor does no batching and exports spans
     * immediately when they end. For most production use cases,
     * OpenTelemetry recommends use of the BatchSpanProcessor.
     */
    tracerProvider.addSpanProcessor(new BatchSpanProcessor(new OTLPTraceExporter(options)))

    /**
     * Registering the provider with the API allows it to be discovered
     * and used by instrumentation libraries. The OpenTelemetry API provides
     * methods to set global SDK implementations, but the default SDK provides
     * a convenience method named `register` which registers same defaults
     * for you.
     *
     * By default the NodeTracerProvider uses Trace Context for propagation
     * and AsyncHooksScopeManager for context management. To learn about
     * customizing this behavior, see API Registration Options below.
     */
    // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
    tracerProvider.register()

    registerInstrumentations({
        instrumentations
    })

    log(`tracing initialized for ${config.serviceName} sending span to ${options.endpoint}`)
    return {
        tracer: opentelemetry.trace.getTracer(config.serviceName),
        addTraceId: async (req, res) => {
            const spanContext = opentelemetry.trace.getSpanContext(opentelemetry.context.active())
            req.traceId = spanContext && spanContext.traceId
        },
        KOAMiddleware: ({ request }, next) => {
            const spanContext = opentelemetry.trace.getSpanContext(opentelemetry.context.active())
            request.traceId = spanContext && spanContext.traceId
            return next()
        }
    }
}
