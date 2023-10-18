const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { AwsInstrumentation } = require('@opentelemetry/instrumentation-aws-sdk')

const instrumentationModules = {
    mysql: {
        modulePath: '@opentelemetry/instrumentation-mysql',
        className: 'MySQLInstrumentation'
    },
    graphql: {
        modulePath: '@opentelemetry/instrumentation-graphql',
        className: 'GraphQLInstrumentation'
    },
    pg: {
        modulePath: '@opentelemetry/instrumentation-pg',
        className: 'PgInstrumentation'
    },
    mongodb: {
        modulePath: '@opentelemetry/instrumentation-mongodb',
        className: 'MongoDBInstrumentation'
    },
    redis: {
        modulePath: '@opentelemetry/instrumentation-redis',
        className: 'RedisInstrumentation'
    },
    ioredis: {
        modulePath: '@opentelemetry/instrumentation-ioredis',
        className: 'IORedisInstrumentation'
    },
    koa: {
        modulePath: '@opentelemetry/instrumentation-koa',
        className: 'KoaInstrumentation'
    },
    express: {
        modulePath: '@opentelemetry/instrumentation-express',
        className: 'ExpressInstrumentation'
    },
    fastify: {
        modulePath: '@opentelemetry/instrumentation-fastify',
        className: 'FastifyInstrumentation'
    },
    lambda: {
        modulePath: '@opentelemetry/instrumentation-aws-lambda',
        className: 'AwsLambdaInstrumentation'
    },
    grpc: {
        modulePath: '@opentelemetry/instrumentation-grpc',
        className: 'GrpcInstrumentation'
    },
    pino: {
        modulePath: '@opentelemetry/instrumentation-pino',
        className: 'PinoInstrumentation'
    },
    winston: {
        modulePath: '@opentelemetry/instrumentation-winston',
        className: 'WinstonInstrumentation'
    }
}

module.exports = function (config = {}) {
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

    // auto instantiate instrumentation modules if they are required
    for (const instrumentation in config.instrumentations) {
        if (Object.prototype.hasOwnProperty.call(config.instrumentations, instrumentation) && config.instrumentations[instrumentation] && instrumentationModules[instrumentation]) {
            const currentModule = instrumentationModules[instrumentation]
            const { [currentModule.className]: Instrumentation } = require(currentModule.modulePath)
            instrumentations.push(new Instrumentation())
        }
    }

    const tracing = require('./src/tracing.js')(config, instrumentations)
    return tracing
}
