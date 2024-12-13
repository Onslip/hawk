// Adapted from DefinitelyTyped: @types/hawk by Florian Imdahl
export type HTTPRequestLike = {
    url?: string | undefined;
    method?: string | undefined;
    headers: Partial<Record<string, string | undefined>>
}

export interface Host {
    name: string;
    port: number;
}

export interface CustomRequest {
    authorization: string;
    contentType: string;
    host: string;
    method: string;
    port: number;
    url: string;
}

export interface ParseRequestOptions {
    host?: string | undefined;
    hostHeaderName?: string | undefined;
    name?: string | undefined;
    port?: number | undefined;
}

export const version: string;

export const limits: {
    /** Limit the length of uris and headers to avoid a DoS attack on string matching */
    maxMatchLength: number;
};

export function setTimeFunction(fn: () => number): void;

export function now(localtimeOffsetMsec: number): number;

export function nowSecs(localtimeOffsetMsec: number): number;

export function parseAuthorizationHeader(header: string, keys?: string[]): Record<string, string | undefined>;

export function parseContentType(header?: string): string;

export function parseHost(req: HTTPRequestLike, hostHeaderName?: string): Host | null;

export function parseRequest(
    req: HTTPRequestLike,
    options?: ParseRequestOptions,
): CustomRequest;

export function unauthorized(
    message?: string,
    attributes?: string | Record<string, number | string | null | undefined>,
): Error /* Boom.Boom & Boom.unauthorized.MissingAuth */;
