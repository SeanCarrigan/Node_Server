const http = require('http'); // Import the built-in HTTP module to create the server
const fs = require('fs'); // Import the built-in File System module to read and write files
const path = require('path'); // Import the built-in Path module to handle file paths
const fsPromises = require('fs').promises; // Import the promises-based File System module

const logEvents = require('./logEvents'); // Import a custom module to log events
const EventEmitter = require('events'); // Import the built-in Events module
const express = require('express'); // Import the Express.js framework (not used in this code)
class Emitter extends EventEmitter {} // Create a custom event emitter class

// Initialize a new instance of the custom event emitter
const myEmitter = new Emitter();

// Add a listener for the 'log' event, which will call the logEvents function
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 3500; // Set the port for the server to listen on

// Define a function to serve a file
const serveFile = async (filePath, contentType, response) => {
  try {
    // Read the file contents asynchronously
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes('image') ? 'utf-8' : ''
    );
    // Parse the data based on the content type
    const data =
      contentType === 'application/json' ? JSON.parse(rawData) : rawData;
    // Set the response headers and status code
    response.writeHead(filePath.includes('404.html') ? 404 : 200, {
      'Content-Type': contentType,
    });
    // Send the response with the file data
    response.end(
      contentType === 'application/json' ? JSON.stringify(data) : data
    );
  } catch (err) {
    // Log any errors that occur
    console.log(err);
    myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
    // Set the response status code to 500 (Internal Server Error)
    response.statusCode = 500;
    response.end();
  }
};

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Log the request URL and method
  console.log(req.url, req.method);
  myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

  // Determine the file extension based on the request URL
  const extension = path.extname(req.url);

  // Set the content type based on the file extension
  let contentType;
  switch (extension) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.txt':
      contentType = 'text/plain';
      break;
    default:
      contentType = 'text/html';
  }

  // Determine the file path based on the request URL
  let filePath =
    contentType === 'text/html' && req.url == '/'
      ? path.join(__dirname, 'views', 'index.html')
      : contentType === 'text/html' && req.url.slice(-1) === '/'
      ? path.join(__dirname, 'views', req.url, 'index.html')
      : contentType === 'text/html'
      ? path.join(__dirname, 'views', req.url)
      : path.join(__dirname, req.url);

  // If the file extension is not provided, assume it's an HTML file
  if (!extension && req.url.slice(-1) !== '/') {
    filePath += '.html';
  }

  // Check if the file exists
  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    // Serve the file
    serveFile(filePath, contentType, res);
  } else {
    // Handle redirects or serve a 404 error page
    switch (path.parse(filePath).base) {
      case 'old-page.html':
        res.writeHead(301, { Location: '/new-page.html' });
        res.end();
        break;
      case 'www-page.html':
        res.writeHead(301, { Location: '/' });
        res.end();
        break;
      default:
        // Serve the 404 error page
        serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
    }
  }
});

// Start the server and listen on the specified port
server.listen(PORT, () => console.log(`Server running of ${PORT}`));
