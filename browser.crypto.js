// TIP: Just set "main" to "dist/browser.js" in package.json to test the browser bundle!

const Buffer = require('buffer').Buffer;

// *** timingSafeEqual: https://github.com/browserify/timing-safe-equal/blob/master/browser.js

exports.timingSafeEqual = function timingSafeEqual(a, b) {
    if (a.length !== b.length) {
        throw new TypeError('Input buffers must have the same length')
    }

    var len = a.length;
    var out = 0;
    var i = -1;

    while (++i < len) {
        out |= a[i] ^ b[i];
    }

    return out === 0;
}

// *** randomBytes: Wrap Crypto.getRandomValues

exports.randomBytes = function randomBytes(size) {
    return crypto.getRandomValues(Buffer.allocUnsafe(size));
}

// *** createHmac: Wrap Crypto-JS

exports.createHmac = function createHmac(algorithm, key) {
    return mac(CryptoJS.algo.HMAC.create(CryptoJS.algo[algorithm.toUpperCase()], convert(key)));
}

// *** createHash: Wrap Crypto-JS

exports.createHash = function createHash(algorithm) {
    return mac(CryptoJS.algo[algorithm.toUpperCase()].create());
}

function convert(bufferOrString) {
    return bufferOrString instanceof Uint8Array
        ? CryptoJS.enc.Base64.parse(btoa(String.fromCharCode.apply(null, bufferOrString)))
        : bufferOrString;
}

function mac(mac) {
    return {
        update: function (data) {
            mac.update(convert(data));
            return this;
        },

        digest: function (encoding) {
            var digest = mac.finalize();
            return encoding === 'base64' ? digest.toString(CryptoJS.enc.Base64) : Buffer.from(digest.toString(), 'hex');
        }
    }
}

// Based on: Crypto-JS v3.1.2
// Copyright (c) 2009-2013, Jeff Mott. All rights reserved.
// http://code.google.com/p/crypto-js/
// http://code.google.com/p/crypto-js/wiki/License

var CryptoJS = CryptoJS || function (h, r) { var k = {}, l = k.lib = {}, n = function () { }, f = l.Base = { extend: function (a) { n.prototype = this; var b = new n; a && b.mixIn(a); b.hasOwnProperty("init") || (b.init = function () { b.$super.init.apply(this, arguments) }); b.init.prototype = b; b.$super = this; return b }, create: function () { var a = this.extend(); a.init.apply(a, arguments); return a }, init: function () { }, mixIn: function (a) { for (let b in a) a.hasOwnProperty(b) && (this[b] = a[b]); a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function () { return this.init.prototype.extend(this) } }, j = l.WordArray = f.extend({ init: function (a, b) { a = this.words = a || []; this.sigBytes = b != r ? b : 4 * a.length }, toString: function (a) { return (a || s).stringify(this) }, concat: function (a) { var b = this.words, d = a.words, c = this.sigBytes; a = a.sigBytes; this.clamp(); if (c % 4) for (let e = 0; e < a; e++) b[c + e >>> 2] |= (d[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((c + e) % 4); else if (65535 < d.length) for (e = 0; e < a; e += 4) b[c + e >>> 2] = d[e >>> 2]; else b.push.apply(b, d); this.sigBytes += a; return this }, clamp: function () { var a = this.words, b = this.sigBytes; a[b >>> 2] &= 4294967295 << 32 - 8 * (b % 4); a.length = h.ceil(b / 4) }, clone: function () { var a = f.clone.call(this); a.words = this.words.slice(0); return a }, random: function (a) { for (let b = [], d = 0; d < a; d += 4) b.push(4294967296 * h.random() | 0); return new j.init(b, a) } }), m = k.enc = {}, s = m.Hex = { stringify: function (a) { var b = a.words; a = a.sigBytes; for (var d = [], c = 0; c < a; c++) { var e = b[c >>> 2] >>> 24 - 8 * (c % 4) & 255; d.push((e >>> 4).toString(16)); d.push((e & 15).toString(16)) } return d.join("") }, parse: function (a) { for (var b = a.length, d = [], c = 0; c < b; c += 2) d[c >>> 3] |= parseInt(a.substr(c, 2), 16) << 24 - 4 * (c % 8); return new j.init(d, b / 2) } }, p = m.Latin1 = { stringify: function (a) { var b = a.words; a = a.sigBytes; for (var d = [], c = 0; c < a; c++) d.push(String.fromCharCode(b[c >>> 2] >>> 24 - 8 * (c % 4) & 255)); return d.join("") }, parse: function (a) { for (var b = a.length, d = [], c = 0; c < b; c++) d[c >>> 2] |= (a.charCodeAt(c) & 255) << 24 - 8 * (c % 4); return new j.init(d, b) } }, t = m.Utf8 = { stringify: function (a) { try { return decodeURIComponent(escape(p.stringify(a))) } catch (b) { throw Error("Malformed UTF-8 data"); } }, parse: function (a) { return p.parse(unescape(encodeURIComponent(a))) } }, q = l.BufferedBlockAlgorithm = f.extend({ reset: function () { this._data = new j.init; this._nDataBytes = 0 }, _append: function (a) { "string" == typeof a && (a = t.parse(a)); this._data.concat(a); this._nDataBytes += a.sigBytes }, _process: function (a) { var b = this._data, d = b.words, c = b.sigBytes, e = this.blockSize, f = c / (4 * e), f = a ? h.ceil(f) : h.max((f | 0) - this._minBufferSize, 0); a = f * e; c = h.min(4 * a, c); if (a) { for (var g = 0; g < a; g += e) this._doProcessBlock(d, g); g = d.splice(0, a); b.sigBytes -= c } return new j.init(g, c) }, clone: function () { var a = f.clone.call(this); a._data = this._data.clone(); return a }, _minBufferSize: 0 }); l.Hasher = q.extend({ cfg: f.extend(), init: function (a) { this.cfg = this.cfg.extend(a); this.reset() }, reset: function () { q.reset.call(this); this._doReset() }, update: function (a) { this._append(a); this._process(); return this }, finalize: function (a) { a && this._append(a); return this._doFinalize() }, blockSize: 16, _createHelper: function (a) { return function (b, d) { return (new a.init(d)).finalize(b) } }, _createHmacHelper: function (a) { return function (b, d) { return (new u.HMAC.init(a, d)).finalize(b) } } }); var u = k.algo = {}; return k }(Math);
(() => { var k = CryptoJS, b = k.lib, m = b.WordArray, l = b.Hasher, d = [], b = k.algo.SHA1 = l.extend({ _doReset: function () { this._hash = new m.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]) }, _doProcessBlock: function (n, p) { for (var a = this._hash.words, e = a[0], f = a[1], h = a[2], j = a[3], b = a[4], c = 0; 80 > c; c++) { if (16 > c) d[c] = n[p + c] | 0; else { var g = d[c - 3] ^ d[c - 8] ^ d[c - 14] ^ d[c - 16]; d[c] = g << 1 | g >>> 31 } g = (e << 5 | e >>> 27) + b + d[c]; g = 20 > c ? g + ((f & h | ~f & j) + 1518500249) : 40 > c ? g + ((f ^ h ^ j) + 1859775393) : 60 > c ? g + ((f & h | f & j | h & j) - 1894007588) : g + ((f ^ h ^ j) - 899497514); b = j; j = h; h = f << 30 | f >>> 2; f = e; e = g } a[0] = a[0] + e | 0; a[1] = a[1] + f | 0; a[2] = a[2] + h | 0; a[3] = a[3] + j | 0; a[4] = a[4] + b | 0 }, _doFinalize: function () { var b = this._data, d = b.words, a = 8 * this._nDataBytes, e = 8 * b.sigBytes; d[e >>> 5] |= 128 << 24 - e % 32; d[(e + 64 >>> 9 << 4) + 14] = Math.floor(a / 4294967296); d[(e + 64 >>> 9 << 4) + 15] = a; b.sigBytes = 4 * d.length; this._process(); return this._hash }, clone: function () { var b = l.clone.call(this); b._hash = this._hash.clone(); return b } }); k.SHA1 = l._createHelper(b); k.HmacSHA1 = l._createHmacHelper(b) })();
(function (k) { for (var g = CryptoJS, h = g.lib, v = h.WordArray, j = h.Hasher, h = g.algo, s = [], t = [], u = function (q) { return 4294967296 * (q - (q | 0)) | 0 }, l = 2, b = 0; 64 > b;) { var d; a: { d = l; for (var w = k.sqrt(d), r = 2; r <= w; r++) if (!(d % r)) { d = !1; break a } d = !0 } d && (8 > b && (s[b] = u(k.pow(l, 0.5))), t[b] = u(k.pow(l, 1 / 3)), b++); l++ } var n = [], h = h.SHA256 = j.extend({ _doReset: function () { this._hash = new v.init(s.slice(0)) }, _doProcessBlock: function (q, h) { for (var a = this._hash.words, c = a[0], d = a[1], b = a[2], k = a[3], f = a[4], g = a[5], j = a[6], l = a[7], e = 0; 64 > e; e++) { if (16 > e) n[e] = q[h + e] | 0; else { var m = n[e - 15], p = n[e - 2]; n[e] = ((m << 25 | m >>> 7) ^ (m << 14 | m >>> 18) ^ m >>> 3) + n[e - 7] + ((p << 15 | p >>> 17) ^ (p << 13 | p >>> 19) ^ p >>> 10) + n[e - 16] } m = l + ((f << 26 | f >>> 6) ^ (f << 21 | f >>> 11) ^ (f << 7 | f >>> 25)) + (f & g ^ ~f & j) + t[e] + n[e]; p = ((c << 30 | c >>> 2) ^ (c << 19 | c >>> 13) ^ (c << 10 | c >>> 22)) + (c & d ^ c & b ^ d & b); l = j; j = g; g = f; f = k + m | 0; k = b; b = d; d = c; c = m + p | 0 } a[0] = a[0] + c | 0; a[1] = a[1] + d | 0; a[2] = a[2] + b | 0; a[3] = a[3] + k | 0; a[4] = a[4] + f | 0; a[5] = a[5] + g | 0; a[6] = a[6] + j | 0; a[7] = a[7] + l | 0 }, _doFinalize: function () { var d = this._data, b = d.words, a = 8 * this._nDataBytes, c = 8 * d.sigBytes; b[c >>> 5] |= 128 << 24 - c % 32; b[(c + 64 >>> 9 << 4) + 14] = k.floor(a / 4294967296); b[(c + 64 >>> 9 << 4) + 15] = a; d.sigBytes = 4 * b.length; this._process(); return this._hash }, clone: function () { var b = j.clone.call(this); b._hash = this._hash.clone(); return b } }); g.SHA256 = j._createHelper(h); g.HmacSHA256 = j._createHmacHelper(h) })(Math);
(() => { var c = CryptoJS, k = c.enc.Utf8; c.algo.HMAC = c.lib.Base.extend({ init: function (a, b) { a = this._hasher = new a.init; "string" == typeof b && (b = k.parse(b)); var c = a.blockSize, e = 4 * c; b.sigBytes > e && (b = a.finalize(b)); b.clamp(); for (var f = this._oKey = b.clone(), g = this._iKey = b.clone(), h = f.words, j = g.words, d = 0; d < c; d++) h[d] ^= 1549556828, j[d] ^= 909522486; f.sigBytes = g.sigBytes = e; this.reset() }, reset: function () { var a = this._hasher; a.reset(); a.update(this._iKey) }, update: function (a) { this._hasher.update(a); return this }, finalize: function (a) { var b = this._hasher; a = b.finalize(a); b.reset(); return b.finalize(this._oKey.clone().concat(a)) } }) })();
(() => { var h = CryptoJS, j = h.lib.WordArray; h.enc.Base64 = { stringify: function (b) { var e = b.words, f = b.sigBytes, c = this._map; b.clamp(); b = []; for (var a = 0; a < f; a += 3) for (var d = (e[a >>> 2] >>> 24 - 8 * (a % 4) & 255) << 16 | (e[a + 1 >>> 2] >>> 24 - 8 * ((a + 1) % 4) & 255) << 8 | e[a + 2 >>> 2] >>> 24 - 8 * ((a + 2) % 4) & 255, g = 0; 4 > g && a + 0.75 * g < f; g++) b.push(c.charAt(d >>> 6 * (3 - g) & 63)); if (e = c.charAt(64)) for (; b.length % 4;) b.push(e); return b.join("") }, parse: function (b) { var e = b.length, f = this._map, c = f.charAt(64); c && (c = b.indexOf(c), -1 != c && (e = c)); for (var c = [], a = 0, d = 0; d < e; d++) if (d % 4) { var g = f.indexOf(b.charAt(d - 1)) << 2 * (d % 4), h = f.indexOf(b.charAt(d)) >>> 6 - 2 * (d % 4); c[a >>> 2] |= (g | h) << 24 - 8 * (a % 4); a++ } return j.create(c, a) }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" } })();
