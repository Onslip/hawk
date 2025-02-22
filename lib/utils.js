'use strict';

const Boom = require('./deps/hapi-boom');


const internals = {};


/** @type import('./utils').version */
exports.version = function () {

    return require('../package.json').version;
};


/** @type import('./utils').limits */
exports.limits = {
    maxMatchLength: 4096            // Limit the length of uris and headers to avoid a DoS attack on string matching
};


/** @type import('./utils').parseHost */
exports.parseHost = function (req, hostHeaderName) {

    hostHeaderName = (hostHeaderName ? hostHeaderName.toLowerCase() : 'host');
    const hostHeader = req.headers[hostHeaderName];
    if (!hostHeader) {
        return null;
    }

    if (hostHeader.length > exports.limits.maxMatchLength) {
        return null;
    }

    if (hostHeader.indexOf('/') !== -1) {
        return null;
    }

    let uri;
    try {
        uri = new URL('http://' + hostHeader);
    }
    catch (err) {
        return null;
    }

    return {
        name: uri.hostname,
        port: (uri.port ? uri.port : (req.connection && req.connection.encrypted ? 443 : 80))
    };
};


// Parse Content-Type header content

/** @type import('./utils').parseContentType */
exports.parseContentType = function (header) {

    if (!header) {
        return '';
    }

    return header.split(';')[0].trim().toLowerCase();
};


// Convert node's  to request configuration object

/** @type import('./utils').parseRequest */
exports.parseRequest = function (req, options) {

    if (!req.headers) {
        return req;
    }

    // Obtain host and port information

    let host;
    if (!options.host ||
        !options.port) {

        host = exports.parseHost(req, options.hostHeaderName);
        if (!host) {
            throw Boom.badRequest('Invalid Host header');
        }
    }

    const request = {
        method: req.method,
        url: req.url,
        host: options.host || host.name,
        port: options.port || host.port,
        authorization: req.headers.authorization,
        contentType: req.headers['content-type'] || ''
    };

    return request;
};


let _now = Date.now;


// override the `now` function, e.g., to use sntp

/** @type import('./utils').setTimeFunction */
exports.setTimeFunction = function (fn) {

    _now = fn;
};


/** @type import('./utils').now */
exports.now = function (localtimeOffsetMsec) {

    return _now() + (localtimeOffsetMsec || 0);
};


/** @type import('./utils').nowSecs */
exports.nowSecs = function (localtimeOffsetMsec) {

    return Math.floor(exports.now(localtimeOffsetMsec) / 1000);
};


internals.authHeaderRegex = /^(\w+)(?:\s+(.*))?$/;                                      // Header: scheme[ something]
internals.attributeRegex = /^[ \w\!#\$%&'\(\)\*\+,\-\.\/\:;<\=>\?@\[\]\^`\{\|\}~]+$/;   // !#$%&'()*+,-./:;<=>?@[]^_`{|}~ and space, a-z, A-Z, 0-9


// Parse Hawk HTTP Authorization header

/** @type import('./utils').parseAuthorizationHeader */
exports.parseAuthorizationHeader = function (header, keys) {

    keys = keys || ['id', 'ts', 'nonce', 'hash', 'ext', 'mac', 'app', 'dlg'];

    if (!header) {
        throw Boom.unauthorized(null, 'Hawk');
    }

    if (header.length > exports.limits.maxMatchLength) {
        throw Boom.badRequest('Header length too long');
    }

    const headerParts = header.match(internals.authHeaderRegex);
    if (!headerParts) {
        throw Boom.badRequest('Invalid header syntax');
    }

    const scheme = headerParts[1];
    if (scheme.toLowerCase() !== 'hawk') {
        throw Boom.unauthorized(null, 'Hawk');
    }

    const attributesString = headerParts[2];
    if (!attributesString) {
        throw Boom.badRequest('Invalid header syntax');
    }

    const attributes = {};
    let errorMessage = '';
    const verify = attributesString.replace(/(\w+)="([^"\\]*)"\s*(?:,\s*|$)/g, ($0, $1, $2) => {

        // Check valid attribute names

        if (keys.indexOf($1) === -1) {
            errorMessage = 'Unknown attribute: ' + $1;
            return;
        }

        // Allowed attribute value characters

        if ($2.match(internals.attributeRegex) === null) {
            errorMessage = 'Bad attribute value: ' + $1;
            return;
        }

        // Check for duplicates

        if (attributes.hasOwnProperty($1)) {
            errorMessage = 'Duplicate attribute: ' + $1;
            return;
        }

        attributes[$1] = $2;
        return '';
    });

    if (verify !== '') {
        throw Boom.badRequest(errorMessage || 'Bad header format');
    }

    return attributes;
};


/** @type import('./utils').unauthorized */
exports.unauthorized = function (message, attributes) {

    return Boom.unauthorized(message || null, 'Hawk', attributes);
};

