const axios = require('axios')
const opentelemetry = require('@opentelemetry/api')

function timeout (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Tracer', () => {
    describe('Normal cases', () => {
        let fastify
        let tracer
        let addTraceId
        let value = 'nok'
        beforeEach(async () => {
            value = 'nok'
            fastify = require('fastify')()
            const tracerModule = require('../index')()
            // Tracing
            tracer = tracerModule.tracer
            addTraceId = tracerModule.addTraceId

            fastify.get('/health', async (req, res) => {
                value = req.id
                res.send({
                    status: 'success'
                })
            })
            fastify.get('/test', async (req, res) => {
                const parentSpan = opentelemetry.trace.getSpan(opentelemetry.context.active())
                const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan)
                const childSpan = tracer.startSpan('doSomeWorkInNewSpan', {
                    attributes: {
                        'code.function': 'doSomeWorkInNewSpan'
                    }
                }, ctx)
                await timeout(50)
                childSpan.end()
                value = req.id
                res.send({
                    status: 'success'
                })
            })
            fastify.addHook('onRequest', addTraceId)

            await fastify.listen(3001, '0.0.0.0')
        })

        afterEach(async () => {
            jest.clearAllMocks()
            fastify.close()
        })

        it('should start tracer', async () => {
            expect(value).toEqual('nok')
            await axios.get('http://localhost:3001/health')
            expect(value).toEqual('req-1')
        })

        it('should add custom trace', async () => {
            expect(value).toEqual('nok')
            await axios.get('http://localhost:3001/test')
            expect(value).toEqual('req-1')
        })

        it('should add fastify instrumentation', async () => {
            const tracerModule = require('../index')({
                instrumentations: {
                    mysql: true,
                    unknown: true
                }
            })
            tracer = tracerModule.tracer
            expect(value).toEqual('nok')
            await axios.get('http://localhost:3001/test')
            expect(value).toEqual('req-1')
        })
    })
})
