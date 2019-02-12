const http = require('http');
const app = require('./app');

const port = process.env.NEWS_API_PORT || 8000;
const server = http.createServer(app);

server.listen(port);
