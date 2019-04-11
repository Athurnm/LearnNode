/*
 * Primary file for the API
 */

 // Dependencies
 const http = require('http'); //library to run http protocol
 const url = require('url'); //library for accessing url
 const StringDecoder = require('string_decoder').StringDecoder;
 const configuration = require('./config'); //use environment config

 // The server should response to all request with a string
 var server = http.createServer((req,res) => {
    
    // GET the URL and parse 
    var parsedUrl = url.parse(req.url,true);

    // GET the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // GET the query string as an object
    const queryStringObject = parsedUrl.query;

    // GET the HTTP Method
    const method = req.method.toUpperCase();
    
    // GET the headers as an object 
    const headers = req.headers;

    // GET the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data)=>{
        buffer += decoder.write(data);
    });
    req.on('end',()=>{
        buffer += decoder.end();

        // choose the right handler based on a handler req
        const chosenHandlers = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // construct data object to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        // Route the request to the handler specified in the router
        chosenHandlers(data,(statusCode,payload)=>{
            // use the static code calledback by the handler or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode:200;

            // use the payload called back by the handler
            payload = typeof (payload) == 'object' ? payload : {}

            //convert the payload to string
            const payloadString = JSON.stringify(payload);

            //return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
            console.log('Returning this response: ', statusCode,payloadString);
        })
        // send the response
        res.end('hello world \n');

       
    });

    
 });

 // Start the server
 server.listen(configuration.port,()=>{
     console.log("The server is running on "+configuration.port+' in '+configuration.envName+' now');
 });

 // Define the handlers
 const handlers = {};

// Ping handler 
handlers.ping = (data,callback)=>{
    callback(200);
};

 // not found handler
 handlers.notFound = (data,callback)=>{
    callback(404);
 };

 // Define a request router
 const router = {
     'ping' : handlers.ping
 }