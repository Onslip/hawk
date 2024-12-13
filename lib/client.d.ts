// Adapted from DefinitelyTyped: @types/hawk by Florian Imdahl
import * as Crypto from "./crypto";

export type URLLike = Pick<URL, 'href' | 'protocol' | 'hostname' | 'port' | 'pathname' | 'search'>;
export type HTTPMessageLike = { headers: Record<string, string | undefined> };

export interface HeaderOptions {
    /** Oz application id */
    app?: string | undefined;
    /** Payload content-type (ignored if hash provided) */
    contentType?: string | undefined;
    credentials: Crypto.Credentials;
    /** Oz delegated-by application id */
    dlg?: string | undefined;
    /** Application specific data sent via the ext attribute */
    ext?: string | undefined;
    /** Pre-calculated payload hash */
    hash?: string | undefined;
    /** Time offset to sync with server time (ignored if timestamp provided) */
    localtimeOffsetMsec?: number | undefined;
    /** A pre-generated nonce */
    nonce?: string | undefined;
    /** UTF-8 encoded string or Uint8Array for body hash generation (ignored if hash provided) */
    payload?: string | Uint8Array | undefined;
    /** A pre-calculated timestamp in seconds */
    timestamp?: number | undefined;
}

export interface Header {
    header: string;
    artifacts: Crypto.Artifacts;
}

export interface AuthenticateOptions {
    /** optional payload received */
    payload?: string | Uint8Array | undefined;
    /** specifies if a Server-Authorization header is required. Defaults to 'false' */
    required?: boolean | undefined;
}

export interface Authentication {
    headers: Record<string, string | undefined>;
}

export interface BewitOptions {
    credentials: Crypto.Credentials;
    /** Application specific data sent via the ext attribute */
    ext?: string | undefined;
    /** Time offset to sync with server time */
    localtimeOffsetMsec: number;
    /** TTL in seconds */
    ttlSec: number;
}

export interface MessageOptions {
    credentials: Crypto.Credentials;
    /** Time offset to sync with server time (ignored if timestamp provided) */
    localtimeOffsetMsec: number;
    /** A pre-generated nonce */
    nonce: string;
    /** A pre-calculated timestamp in seconds */
    timestamp: number;
}

export interface Message {
    hash: string;
    id: string;
    mac: string;
    nonce: string;
    ts: string;
}

export function authenticate(
    res: HTTPMessageLike,
    credentials: Crypto.Credentials,
    artifacts: Crypto.Artifacts,
    options?: AuthenticateOptions,
): Authentication;

export function getBewit(uri: string | URLLike, options: BewitOptions): string;

export function header(uri: string | URLLike, method: string, options?: HeaderOptions): Header;

export function message(host: string, port: number, message: string, options?: MessageOptions): Message;
