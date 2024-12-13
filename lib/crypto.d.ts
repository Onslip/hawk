// Adapted from DefinitelyTyped: @types/hawk by Florian Imdahl

export type HashLike = { update: (data: string) => void; digest: (encoding: string) => string; };

export interface Artifacts {
    app?: string | undefined;
    dlg?: string | undefined;
    ext?: string | undefined;
    hash?: string | undefined;
    host: string;
    method: string;
    nonce: string;
    port: number;
    resource: string;
    ts: string;
}

export interface Credentials {
    algorithm: "sha1" | "sha256";
    id: string;
    key: string | Uint8Array;
}

export interface TimestampMessage {
    ts: number;
    tsm: string;
}

export const headerVersion: string;

export const algorithms: string[];

export function calculateMac(type: string, credentials: Credentials, options: Artifacts): string;

export function generateNormalizedString(type: string, options: Artifacts): string;

export function calculatePayloadHash(payload: string | Uint8Array, algorithm: string, contentType: string): string;

export function initializePayloadHash(algorithm: string, contentType: string): HashLike;

export function finalizePayloadHash(hash: HashLike): string;

export function calculateTsMac(ts: string, credentials: Credentials): string;

export function timestampMessage(credentials: Credentials, localtimeOffsetMsec: number): TimestampMessage;
