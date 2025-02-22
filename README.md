# hawk

#### HTTP Holder-Of-Key Authentication Scheme.

Documentation of the protocol, and the JS API, is in https://github.com/onslip/hawk/blob/main/API.md.

> [!Important]
> This fork is identical to <https://github.com/mozilla/hawk>, except that it no longer (indirectly) depends on large
> internal Node.js libraries, making it more suitable for bundling in a browser environment or embedding in a small
> Node.js project. [Pre-built browser bundles](https://cdn.jsdelivr.net/npm/@onslip/hawk/dist/) and TypeScript
> definitions are also included.

## Ownership Changes

This was once `hueniverse/hawk` and relased as `hawk`.
Then, after the 7.0.10 release, it was moved to the `hapijs/hawk` repository and released as `@hapi/hawk`.
Hapi later de-supported the library, after releasing version 8.0.0.
It has since been moved to `mozilla/hawk` and is again released as `hawk`.
All of the intermediate versions are also relased as `hawk`.
This fork is `@onslip/hawk`, since Mozilla has archived the original repository.

Changes are represented in GitHub releases on this repository.

Mozilla maintains several Hawk implementations in different langauages, so it is likely to stay at Mozilla for some time.

This library is in "maintenance mode" -- no features will be added, and only security-related bugfixes will be applied.
