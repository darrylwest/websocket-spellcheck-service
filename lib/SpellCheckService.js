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
        checker = options.checker || require('spellchecker'),
        id = options.id || uuid.v4();

    this.start = function() {
        log.info('start the spell service');
    };

    this.createProducer = function() {
        log.info('create the spell check message producer');
    };

    // constructor validations
    if (!log) throw new Error('server must be constructed with a log');
};

SpellCheckService.DEFAULT_CHANNEL = '/spellcheck';

SpellCheckService.createInstance = function(opts) {
    'use strict';

    if (!opts) opts = {};

    // if (opts.log)

    return new SpellCheckService( opts );
};

module.exports = SpellCheckService;