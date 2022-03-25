const axios = require('axios')

describe('Tracer', () => {
    describe('Normal cases', () => {
        let fastify
        let tracer
        let addTraceId
        let value = 'nok'
        beforeEach(async () => {
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
    })
})
