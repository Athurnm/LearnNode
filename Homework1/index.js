/*
 * filename: index.js
 * Primary file for API
 * Description: Hello world API, an API that sends Hello world
 * methods: works in RESTful JSON API
 * do: request to route /hello, response welcome message in JSON
 */

// Dependencies
const http = require ('http') //NodeJS built-in library to handle http protocols
const url = require('url') //NodeJS built-in library to handler address
const StringDecoder = require('string_decoder').StringDecoder

// The server should response to any string request
const server = http.createServer((req,res)=>{

    // get the parsed URL 
    const parsedURL = url.parse(req.url)

    // get the path
    const path = parsedURL.pathname //getting path name from url parsing
    const trimmedPath = path.replace(/^\/+|\/+$/g,'') // replace "/\+" and their combination with null to trim the path

    // get the HTTP method
    const method = req.method.toUpperCase()

    // get the header
    const header = req.headers

    // GET the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data)=>{
        buffer += decoder.write(data);
    })

    req.on('end',()=>{
        buffer += decoder.end();

        // choose the right handler based on a handler req
        const chosenHandlers = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

        // make the JSON data for response
        let balasan = {
            'title' : 'judul',
            'welcome': 'selamat datang',
            'description': 'it is the translation of english to my native language Indonesia'
        }

        // construct data object to the handler
        const data = {
            'trimmedPath' : trimmedPath,
            'method': method,
            'headers': header,
            'payload': balasan
        }

        chosenHandlers(data,(statusCode,payload)=>{
            // use the static code calledback by the handler or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode:200;

            // use the 'balasan' data as payload
            payload = balasan

            //convert the payload to string
            let payloadString = JSON.stringify(payload);

            //return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            payloadString = statusCode == 200 ? payloadString: 'page not found'
            res.end(payloadString);

            // Log the request path
            console.log('Returning this response: ', statusCode,payloadString);
        })
    })
})

// Start the server
server.listen(4000,()=>{
    console.log("The server is running on port "+4000);
});

// Define the handlers
const handlers = {};

// Ping handler 
handlers.hello = (data,callback)=>{
   callback(200);
};

// not found handler
handlers.notFound = (data,callback)=>{
   callback(404);
};

// Define a request router
const router = {
    'hello' : handlers.hello
}
