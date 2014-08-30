/**
 * @class AccessClient
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/27/14
 */

var SpellCheckClient = function(options) {
    'use strict';

    var client = this,
        log = options.log,
        socketHost = options.socketHost,
        accessHub,
        accessQueue = [],
        aid = Math.random().toString(20),
        pid = Math.random().toString(20);

    /**
     * open the public/private channels to begin exchanges
     */
    this.openSockets = function() {
        this.openAccessChannel();
        this.openPrivateChannel();
    };

    /**
     * close all socket channels
     */
    this.closeSockets = function() {
        var hub = client.createHub();

        hub.unsubscribe( user.privateChannel );
        hub.unsubscribe( '/access' );

        log.info('channels closed');
    };

    /**
     * open / subscribe to the public access channel
     *
     * @returns access channel
     */
    this.openSpellCheckChannel = function() {
        var hub = client.createHub(),
            channel = hub.subscribe( '/access', client.accessMessageHandler );

        log.info('open the access channel: ', channel);

        channel.then(function() {
            log.info('access channel alive...');
        });

        return channel;
    };

    /**
     * open the user's private channel
     * @returns private channel
     */
    this.openPrivateChannel = function() {
        var hub = client.createHub(),
            channel = hub.subscribe( user.privateChannel, client.privateMessageHandler );

        log.info('open the private channel: ', channel);

        channel.then(function() {
            log.info('private channel alive...');
            var request = {};

            request.user = { id:user.id, session:user.session };
            request.action = 'openPrivateChannel';

            accessQueue.push( request );
        });

        return channel;
    };

    /**
     * create the standard wrapper
     *
     * @param id the channel id
     * @param request a request object
     * @returns the wrapped message request
     */
    this.wrapMessage = function(id, request) {
        var message = {
            ssid:id,
            ts:Date.now(),
            message:request
        };

        return message;
    };

    /**
     * the public access channel message handler; grab the current token and queue
     * the outgoing private message
     *
     * @param msg - a wrapped message request
     */
    this.spellCheckMessageHandler = function(msg) {
        if (accessQueue.length > 0) {
            var request = accessQueue.pop(),
                message;

            // grab the current token
            request.token = msg.message.token;

            message = client.wrapMessage( aid, request );
            log.info( JSON.stringify( message ) );

            accessHub.publish( '/spellcheck', message );
        }
    };

    /**
     * the private channel message response handler; processes ready, ok, and failed
     *
     * @param msg - a wrapped response
     */
    this.privateMessageHandler = function(msg) {
        log.info( 'p-msg: ', JSON.stringify( msg ));

        var status = msg.message.status;
        if (status) {
            switch (status) {
                case 'ready':
                    client.sendPrivateMessage();
                    break;
                case 'ok':
                    log.info('return the spell word and suggestions');

                    break;
            }
        }
    };

    // constructor validations
    if (!log) throw new Error('access client must be constructed with a log');
};

AccessClient.createInstance = function(opts) {
    'use strict';

    if (!opts) opts = {};

    opts.version = '2014.08.29';

    opts.log = RemoteLogger.createLogger('SpellCheckClient');

    // simulate an ajax fetch...

    opts.host = 'http://localhost:29169';
    opts.hubName = '/MessageHub';
    opts.appkey = '71268c55-a8b3-4839-a1f5-34e3d6e70fdd';

    opts.socketHost = opts.host + opts.hubName;

    return new SpellCheckClient( opts );
};

if (typeof module === 'object') {
    module.exports = SpellCheckClient;
}