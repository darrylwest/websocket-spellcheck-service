#!/usr/bin/env node

var config = require( __dirname + '/../config.json'),
    SpellCheckService = require( __dirname + '/../index'),
    service;
    
// don't run in background...
config.daemon = false;
console.log('message hub: ', config.hubName);

service = SpellCheckService.createInstance( config );
service.start();

