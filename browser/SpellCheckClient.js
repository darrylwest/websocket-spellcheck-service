/**
 * @class SpellCheckClient
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/27/14
 */
if (typeof require === 'function') {
    AbstractMessageClient = require('./AbstractMessageClient');
}

var SpellCheckClient = function(options) {
    'use strict';

    var client = this,
        log = options.log,
        channelName = '/spellcheck',
        appkey = options.appkey, // the spell checker's ssid
        checkResultCallback = options.checkResultCallback,
        cid = Math.random().toString(20);

    AbstractMessageClient.extend( client, options );

    /**
     * open the public/private channels to begin exchanges
     */
    this.start = function() {
        log.info('open the spell-check channel: ', channelName);
        client.subscribe( channelName, client.spellCheckMessageHandler );
    };

    /**
     * the public access channel message handler; grab the current token and queue
     * the outgoing private message
     *
     * @param msg - a wrapped message request
     */
    this.spellCheckMessageHandler = function(msg) {

        if (msg.ssid === appkey) {
            log.info( JSON.stringify( msg ));
        }

        if (checkResultCallback) {
            checkResultCallback( msg.message );
        }
    };

    this.checkSpelling = function(word) {
        log.info('spell check the word: ', word);

        var request = {
            word:word,
            action:'check'
        };

        client.publish( channelName, cid, request );
    };

    // constructor validations
    if (!log) throw new Error('access client must be constructed with a log');
};

SpellCheckClient.createInstance = function(opts) {
    'use strict';

    if (!opts) opts = {};

    opts.version = '2014.08.31';
    opts.log = RemoteLogger.createLogger('SpellCheckClient');

    return new SpellCheckClient( opts );
};

if (typeof module === 'object') {
    module.exports = SpellCheckClient;
}
