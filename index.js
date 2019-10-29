//importing express
const express = require('express');
//creating the server invoking express
const server = express();
//middleware - teaches how to read JSON needed for post and put to work
server.use(express.json())
//setting up import for router
const postRouter = require('./postRouter');


// set up endpoint for urls
server.use('/api/posts', postRouter)

//set up API port and server is listening
const port = 5000;
server.listen(port, ()=> console.log(`API running on port ${port}`));

module.exports = server;
