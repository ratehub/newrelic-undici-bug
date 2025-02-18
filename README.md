# Description

The undici instrumentation reports errors that have been caught in a try/catch. This causes noise and we're forced to either ignore all undici errors or live with a poor signal-to-noise ratio. 

# Running the reproduction

Copy .env.example to .env and fill out the newrelic license key

Run `pnpm i` to install dependencies

Run `pnpm dev` to run the reproduction script.

Observe that APM reports TWO errors.

1. `Lee custom error`
2. `getaddrinfo ENOTFOUND somethingthatdoesntexist.newrelic.com`

The `getaddrinfo` error should never be reported as we've caught the error with our try/catch.