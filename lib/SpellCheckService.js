/**
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/30/14
 */
var dash = require('lodash'),
    uuid = require('node-uuid'),
    MessageHub = require('node-messaging-commons');

var SpellCheckService = function(options) {
    'use strict';

    var service = this,
        log = options.log,
        hub = options.hub,
        channel = options.channel || SpellCheckService.DEFAULT_CHANNEL,
        checker = options.checker || require('spellchecker'),
        producer = options.producer,
        id = options.appkey;

    /**
     * start the spell service to begin responding to client requests
     */
    this.start = function() {
        log.info('start the spell service');

        service.createMessageProducer();
    };

    this.createMessageProducer = function() {
        if (!producer) {
            log.info('create the spell check message producer, id: ', id);

            producer = hub.createProducer( channel, id );
            producer.onMessage( service.messageHandler );
        }

        return producer;
    };

    this.messageHandler = function(msg) {
        if (msg.ssid !== id) {
            log.info('<< ', JSON.stringify( msg ));

            var request = msg.message,
                action = request.action;

            if (action && action === 'check') {
                service.checkSpelling( request );
            }
        }
    };

    this.checkSpelling = function(request) {
        var word = request.word,
            correct = (! checker.isMisspelled( word )),
            response = {
                word:word,
                correct:correct
            };

        if (!correct) {
            response.suggestions = checker.getCorrectionsForMisspelling( word );
        }

        log.info( '>> ', JSON.stringify( response ) );

        producer.publish( response );
    };

    // constructor validations
    if (!log) throw new Error('server must be constructed with a log');
    if (!hub) throw new Error('server must be constructed with a message hub');
    if (!id) throw new Error('server must be constructed with an appkey');
};

SpellCheckService.DEFAULT_CHANNEL = '/spellcheck';

SpellCheckService.createInstance = function(config) {
    'use strict';

    var logManager;

    if (!config) throw new Error('must be constructed with a config object');
    if (!config.port) throw new Error('server must be constructed with a port');
    if (!config.hubName) throw new Error('server must be constructed with a hub name');

    // don't damage the original
    config = dash.clone( config );

    logManager = require('simple-node-logger').createLogManager();

    var createSpellCheckService = function() {
        var opts = dash.clone( config );

        opts.log = logManager.createLogger('SpellCheckService');

        return new SpellCheckService( opts );
    };

    if (!config.hub) {
        config.hub = MessageHub.createInstance( config );
    }

    return createSpellCheckService( config );
};

module.exports = SpellCheckService;