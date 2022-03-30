[![GitHub release](https://img.shields.io/npm/v/%40voodoo.io%2Ftracing-middleware.svg)](https://github.com/VoodooTeam/tracing-middleware/releases/)
[![GitHub license](https://img.shields.io/github/license/VoodooTeam/tracing-middleware.svg)](https://github.com/VoodooTeam/tracing-middleware/blob/master/LICENSE)
[![Opened PR](https://img.shields.io/github/issues-pr-raw/VoodooTeam/tracing-middleware.svg)](https://github.com/VoodooTeam/tracing-middleware/pulls)
[![Opened issues](https://img.shields.io/github/issues/VoodooTeam/tracing-middleware.svg)](https://github.com/VoodooTeam/tracing-middleware/issues)
[![CI pipeline](https://img.shields.io/github/workflow/status/VoodooTeam/tracing-middleware/Node.js%20CI/master.svg)](https://github.com/VoodooTeam/tracing-middleware/actions?query=workflow%3A%22Node.js+CI%22)
[![Code coverage](https://img.shields.io/codecov/c/github/VoodooTeam/tracing-middleware.svg)](https://codecov.io/gh/VoodooTeam/tracing-middleware)
[![Dependencies updates](https://img.shields.io/david/VoodooTeam/tracing-middleware.svg)](https://github.com/VoodooTeam/tracing-middleware)
[![Dependencies updates](https://img.shields.io/david/dev/VoodooTeam/tracing-middleware.svg)](https://github.com/VoodooTeam/tracing-middleware)
[![Node version](https://img.shields.io/node/v-lts/%40voodoo.io%2Ftracing-middleware.svg)](https://github.com/VoodooTeam/tracing-middleware)
[![Code coverage](https://codecov.io/gh/VoodooTeam/tracing-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/VoodooTeam/tracing-middleware)

# Tracing middleware with open tracing libs

## Purpose

A simple middleware to enable tracing with opentelemetry lib.
It will instantiate some instrumentation libs in order to catch span for:
* HTTP calls
* AWS SDK
* Mysql
* MongoDB
* Postgres
* Web frameworks: Fastify, Express, Koa
* AWS Lambda
* Redis
* GraphQL
* GRPC

## Installation

```bash
npm install tracing-middleware --save
```

## Usage

### Basic usage
```javascript
const tracer = require('tracing-middleware')()
```

### Use addTraceId method
This method will add the traceID in the req object.
```javascript
const tracingModule = require('tracing-middleware')()

fastify.addHook('onRequest', tracingModule.addTraceId)
```

### Configuration
Example of configuration, using tempo as endpoint.
```javascript
const tracer = require('tracing-middleware')({
    serviceName:: 'myService',
    exporterEndpoint: 'http://tempo.monitoring.svc.cluster.local:14268/api/traces',
    instrumentations: {
        mysql: true,
        lambda: true
    }
})
```

| Name                       | Default                            | Description                 |
|:---------------------------|:-----------------------------------|:----------------------------|
| serviceName                | process.env.OTEL_SERVICE_NAME      | Your service's name         |
| exporterEndpoint           | process.env.OTEL_EXPORTER_ENDPOINT | The opentelemetry endpoint  |
| instrumentations           |                                    | List of instrumentations    |
| instrumentations.http      | true                               |                             |
| instrumentations.aws       | true                               |                             |
| instrumentations.mysql     | false                              |                             |
| instrumentations.mongodb   | false                              |                             |
| instrumentations.pg        | false                              |                             |
| instrumentations.redis     | false                              |                             |
| instrumentations.ioredis   | false                              |                             |
| instrumentations.graphql   | false                              |                             |
| instrumentations.koa       | false                              |                             |
| instrumentations.express   | false                              |                             |
| instrumentations.fastify   | false                              |                             |
| instrumentations.lambda    | false                              |                             |
| instrumentations.grpc      | false                              |                             |

## Compatibility


| Version       | Supported     | Tested         |
|:-------------:|:-------------:|:--------------:|
| 16.x          | yes           | yes            |
| 14.x          | yes           | yes            |

## Debug
```bash
DEBUG=tracing-middleware* node myApp.js
```

## Test

```bash
$ npm test
```

Run with coverage

```bash
$ npm run coverage
```

Coverage report can be found in coverage/.

## License

MIT
