/**
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/30/14
 */
var should = require('chai').should(),
    dash = require('lodash'),
    MockLogger = require('simple-node-logger').mocks.MockLogger,
    SpellCheckService = require('../lib/SpellCheckService');

describe('SpellCheckService', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        opts.log = MockLogger.createLogger('SpellCheckService');
        opts.hub = {};
        opts.appkey = 'test-server';

        return opts;
    };

    describe('#instance', function() {
        var service = new SpellCheckService( createOptions()),
            methods = [
                'start',
                'createMessageProducer',
                'messageHandler',
                'checkSpelling'
            ];

        it('should create an instance of SpellCheckService', function() {
            should.exist( service );
            service.should.be.instanceof( SpellCheckService );
        });

        it( 'should contain all known methods based on method count and type', function() {
            dash.methods( service ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                service[ method ].should.be.a('function');
            });
        });
    });
});