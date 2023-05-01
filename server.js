const http = require('http');
const fs = require('fs');
const url = require('url');

const port = 8080;

http.createServer((req, res) => {
    let addr = req.url;
    let q = url.parse(addr, true);
    let filePath = '';

    let logString = 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n';
    fs.appendFile('log.txt', logString, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.')
        }
    })

    if (q.pathname.includes('documentation')) {
        filePath = __dirname + '/documentation.html';
    } else {
        filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    })
}).listen(port);

console.log('Node test server running on port: ' + port);