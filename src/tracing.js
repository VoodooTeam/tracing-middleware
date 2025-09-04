const debug = require('debug')
const log = debug('tracing-middleware')
const opentelemetry = require('@opentelemetry/api')
const { NodeSDK } = require('@opentelemetry/sdk-node')
const { resourceFromAttributes } = require('@opentelemetry/resources')
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')

module.exports = function (config, instrumentations) {
    // Check if a tracer provider is already set.
    if (opentelemetry.trace.getTracerProvider() !== opentelemetry.trace.getTracerProvider('default')) {
        log('tracing is already initialized')
    } else {
        // Define the service resource using the recommended resourceFromAttributes function
        const resource = resourceFromAttributes({
            [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
            // Loki has only the field "app"
            app: config.serviceName
        })

        // Configure the OTLPTraceExporter
        const exporterOptions = {
            url: config.exporterEndpoint
        }
        const traceExporter = new OTLPTraceExporter(exporterOptions)

        // Create the NodeSDK instance
        const sdk = new NodeSDK({
            resource,
            traceExporter,
            instrumentations
        })

        // Start the SDK
        sdk.start()

        log(`tracing initialized for ${config.serviceName} sending spans to ${config.exporterEndpoint}`)

        // Handle graceful shutdown
        process.on('SIGINT', () => sdk.shutdown().finally(() => process.exit(0)))
    }

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
