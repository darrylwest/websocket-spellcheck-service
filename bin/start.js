#!/usr/bin/env node

var config = require( __dirname + '/../config.json'),
    SpellCheckService = require( __dirname + '/../index'),
    service;
    
// run in background...
config.daemon = true;

service = SpellCheckService.createInstance( config );
service.start();

