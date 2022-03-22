[![GitHub release](https://img.shields.io/npm/v/tracing-middleware.svg)](https://github.com/VoodooTeam/tracing-middleware/releases/)
[![GitHub license](https://img.shields.io/github/license/VoodooTeam/tracing-middleware.svg)](https://github.com/VoodooTeam/tracing-middleware/blob/master/LICENSE)
[![Opened PR](https://img.shields.io/github/issues-pr-raw/VoodooTeam/tracing-middleware.svg)](https://github.com/VoodooTeam/tracing-middleware/pulls)
[![Opened issues](https://img.shields.io/github/issues/VoodooTeam/tracing-middleware.svg)](https://github.com/VoodooTeam/tracing-middleware/issues)
[![CI pipeline](https://img.shields.io/github/workflow/status/VoodooTeam/tracing-middleware/Node.js%20CI/main.svg)](https://github.com/VoodooTeam/tracing-middleware/actions?query=workflow%3A%22Node.js+CI%22)
[![Code coverage](https://img.shields.io/codecov/c/github/VoodooTeam/tracing-middleware.svg)](https://codecov.io/gh/VoodooTeam/tracing-middleware)
[![Dependencies updates](https://img.shields.io/david/VoodooTeam/tracing-middleware.svg)](https://github.com/VoodooTeam/tracing-middleware)
[![Dependencies updates](https://img.shields.io/david/dev/VoodooTeam/tracing-middleware.svg)](https://github.com/VoodooTeam/tracing-middleware)
[![Node version](https://img.shields.io/node/v-lts/tracing-middleware.svg)](https://github.com/VoodooTeam/tracing-middleware)

# Tracing middleware with open tracing libs

## Purpose

A simple middleware to enable tracing with opentelemetry lib.
It will instantiate some instrumentation libs in order to catch span for:
* HTTP calls
* AWS SDK
* Mysql

## Installation

```bash
$ npm install tracing-middleware --save
```

## Usage


## Compatibility


| Version       | Supported     | Tested         |
|:-------------:|:-------------:|:--------------:|
| 16.x          | yes           | yes            |
| 14.x          | yes           | yes            |

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
