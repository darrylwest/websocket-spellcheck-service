/**
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/31/14
 */
var should = require('chai').should(),
    dash = require('lodash'),
    MockLogger = require('simple-node-logger').mocks.MockLogger,
    SpellCheckClient = require('../browser/SpellCheckClient');

describe('SpellCheckClient', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        opts.log = MockLogger.createLogger('SpellCheckClient');
        opts.hub = {};
        opts.appkey = 'test-server';

        return opts;
    };

    describe('#instance', function() {
        var client = new SpellCheckClient( createOptions()),
            methods = [
                'start',
                'spellCheckMessageHandler',
                'checkSpelling',
                // inherited
                'subscribe',
                'publish',
                'createHub',
                'wrapMessage'
            ];

        it('should create an instance of SpellCheckClient', function() {
            should.exist( client );
            client.should.be.instanceof( SpellCheckClient );
        });

        it( 'should contain all known methods based on method count and type', function() {
            dash.methods( client ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                client[ method ].should.be.a('function');
            });
        });
    });
});