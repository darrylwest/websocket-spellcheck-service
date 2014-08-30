#!/usr/bin/env node

var dash = require('lodash'),
    config = require( __dirname + '/../config.json' ),
    SpellCheckService = require( __dirname + '/../index' ),
    MessageHub = require( 'node-messaging-commons' ),
    hub = MessageHub.createInstance( config ),
    consumer = hub.createConsumer( SpellCheckService.DEFAULT_CHANNEL ),
    words = [
        'flarb',
        'this',
        'is',
        'a',
        'word',
        'spelling',
        'test'
    ],
    idx = 0;

consumer.onMessage(function(msg) {
    console.log( msg );
});

setInterval(function() {
    var request = {},
        word = words.shift();

    // round robbin the word list
    words.push( word );

    console.log('word: ', word);

    request.word = word;
    request.action = 'check';

    consumer.publish( request );
}, 1000);

