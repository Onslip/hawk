// Adapted from DefinitelyTyped: @types/hawk by Florian Imdahl
import * as client from "./client";
import * as crypto from "./crypto";
import * as server from "./server";
import * as utils from "./utils";

export namespace uri {
    const authenticate: typeof server.authenticateBewit;
    const getBewit: typeof client.getBewit;
}

export { client, crypto, server, utils };

export as namespace hawk;
