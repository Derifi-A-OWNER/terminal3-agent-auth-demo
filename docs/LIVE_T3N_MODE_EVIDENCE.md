# Live T3N Mode Evidence

The demo is reviewable without secrets, but it also includes an optional live SDK path.

## Package Boundary

The server imports the real Terminal 3 SDK package:

```text
@terminal3/t3n-sdk@3.9.0
```

The SDK status panel shows:

- package name
- package version
- environment
- whether the SDK import succeeded
- whether a local live key is present

## Local Review Mode

When no local key is set, the app stays in local review mode.

This is intentional for judge safety:

- no secret is required
- no private key is committed
- no key is sent to the browser
- the policy flow remains fully testable

## Optional Live Mode

Judges can set a local key if they want to inspect the SDK handshake/auth path:

```bash
T3N_API_KEY=[local-private-key]
npm run demo
```

or create a local `.env` file:

```text
T3N_API_KEY=[local-private-key]
```

The server loads `.env` through `dotenv`.

## Secret Boundary

The key is read only by `src/t3nGateway.ts`.

The browser receives only:

- SDK status
- masked address preview
- masked DID preview
- live-check availability
- proof-level action results

The browser never receives:

- `T3N_API_KEY`
- raw private key material
- wallet secret
- raw identity data

## Live Check Behavior

When a local key exists, `Run live SDK check` runs the server-side SDK path:

```text
setEnvironment("testnet")
eth_get_address(apiKey)
client.handshake()
client.authenticate(...)
client.getUsage() when available
```

The returned DID is masked before display.

