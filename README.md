# Websocket Access Service
- - -

A real-time spell checking service over web sockets.

<!-- [![NPM version](https://badge.fury.io/js/websocket-access-service.svg)](http://badge.fury.io/js/websocket-access-service)  
[![Build Status](https://travis-ci.org/darrylwest/websocket-spellcheck-service.svg?branch=master)](https://travis-ci.org/darrylwest/websocket-spellcheck-service) [![Dependency Status](https://david-dm.org/darrylwest/websocket-spellcheck-service.svg)](https://david-dm.org/darrylwest/websocket-spellcheck-service) -->

## Introduction

The Websocket Spellcheck Service...

## Installation

### Server

~~~
	npm install websocket-spellcheck-service --save
~~~

### Client/Browser

The project includes a "browser" folder with enough to create a small authentication page.  Once a user enter's their password, it is set then "authenicate" is called. If the backend services are up, then all should work as expected.

Here is a short snippet of the browser code:

~~~
<!DOCTYPE html>
<html>
<head>
    <title>test access page</title>
    <script src="faye-browser.js"></script>
    <script src="RemoteLogger.js"></script>
    <script src="SpellCheckClient.js"></script>
    <script>
        var client;


        // add code here ...
    </script>
</head>
~~~

### Server

The project includes a "bin" folder with a run/start/stop and status scripts.  The run script is the same as start, but it runs in the forgound.  It looks something like this:

~~~
	var config = require('./config.json'),
    	SpellCheckService = require('websocket-spellcheck-service'),
        service = SpellCheckService.createInstance( config );

    service.start();
~~~

If you have a message service running on this port, then this is enough to start the public producer channel to periodically send out access tokens (one per second).  To create and start a generic message service, see [this commons project](https://www.npmjs.org/package/node-messaging-commons).

## Configuration

Here is a sample configuration file.

~~~
{
    "port":29169,
    "hubName":"/MessageHub",
    "channels":[ "/spellcheck" ],
    "appkey":"???"
}
~~~

You would want to have a proxy and preferrably HTTPS in front of this but port 29169 works for development.

## Tests

Unit tests include should/specs, jshint and validate-package.  Tests can be run from the command line with this:

~~~
    make test

    or

    make watch

    or

    grunt mochaTest jshint validate-package
~~~

- - -
<p><small><em>Copyright © 2014, rain city software | Version 0.90.10</em></small></p>