const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { AwsInstrumentation } = require('@opentelemetry/instrumentation-aws-sdk')
const { MySQLInstrumentation } = require('@opentelemetry/instrumentation-mysql')

module.exports = function (config) {
    if (!config.serviceName) {
        config.serviceName = process.env.OTEL_SERVICE_NAME
    }
    if (!config.exporterEndpoint) {
        config.exporterEndpoint = process.env.OTEL_EXPORTER_ENDPOINT
    }

    if (!config.instrumentations) config.instrumentations = []

    const instrumentations = [
        new HttpInstrumentation(),
        new AwsInstrumentation()
    ]

    if (config.instrumentations.Mysql) {
        instrumentations.push(new MySQLInstrumentation())
    }
    const tracing = require('./src/tracing.js')(config, instrumentations)
    return tracing
}
