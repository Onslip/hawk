'use strict';

const Code = require('@hapi/code');
const Hawk = require('..');
const Hoek = require('../lib/deps/hapi-hoek');
const Lab = require('@hapi/lab');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('README', () => {

    describe('core', () => {

        const credentials = {
            id: 'dh37fgj492je',
            key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
            algorithm: 'sha256'
        };

        const options = {
            credentials,
            timestamp: 1353832234,
            nonce: 'j4h3g2',
            ext: 'some-app-ext-data'
        };

        it('should generate a header protocol example', () => {

            const { header } = Hawk.client.header('http://example.com:8000/resource/1?b=1&a=2', 'GET', options);
            expect(header).to.equal('Hawk id="dh37fgj492je", ts="1353832234", nonce="j4h3g2", ext="some-app-ext-data", mac="6R4rV5iE+NPoym+WwjeHzjAGXUtLNIxmo1vpMofpLAE="');
        });

        it('should generate a normalized string protocol example', () => {

            const normalized = Hawk.crypto.generateNormalizedString('header', {
                credentials,
                ts: options.timestamp,
                nonce: options.nonce,
                method: 'GET',
                resource: '/resource/1?b=1&a=2',
                host: 'example.com',
                port: 8000,
                ext: options.ext
            });

            expect(normalized).to.equal('hawk.1.header\n1353832234\nj4h3g2\nGET\n/resource/1?b=1&a=2\nexample.com\n8000\n\nsome-app-ext-data\n');
        });

        const payloadOptions = Hoek.clone(options);
        payloadOptions.payload = 'Thank you for flying Hawk';
        payloadOptions.contentType = 'text/plain';

        it('should generate a header protocol example (with payload)', () => {

            const { header } = Hawk.client.header('http://example.com:8000/resource/1?b=1&a=2', 'POST', payloadOptions);
            expect(header).to.equal('Hawk id="dh37fgj492je", ts="1353832234", nonce="j4h3g2", hash="Yi9LfIIFRtBEPt74PVmbTF/xVAwPn7ub15ePICfgnuY=", ext="some-app-ext-data", mac="aSe1DERmZuRl3pI36/9BdZmnErTw3sNzOOAUlfeKjVw="');
        });

        it('should generate a normalized string protocol example (with payload)', () => {

            const normalized = Hawk.crypto.generateNormalizedString('header', {
                credentials,
                ts: options.timestamp,
                nonce: options.nonce,
                method: 'POST',
                resource: '/resource/1?b=1&a=2',
                host: 'example.com',
                port: 8000,
                hash: Hawk.crypto.calculatePayloadHash(payloadOptions.payload, credentials.algorithm, payloadOptions.contentType),
                ext: options.ext
            });

            expect(normalized).to.equal('hawk.1.header\n1353832234\nj4h3g2\nPOST\n/resource/1?b=1&a=2\nexample.com\n8000\nYi9LfIIFRtBEPt74PVmbTF/xVAwPn7ub15ePICfgnuY=\nsome-app-ext-data\n');
        });
    });
});

