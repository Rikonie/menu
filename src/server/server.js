const http = require("http");
const fs = require('fs').promises;

const host = 'localhost';
const port = 8000;
const data = require('./products.json');

let indexJsonFile;

const requestListener = function (req, res) {
    res.setHeader("Content-Type", "application/json");
    if (req.url === "/all_products") {
        res.writeHead(200);
        res.end(indexJsonFile);
    }
    if (req.url.includes("/product/")) {
        let search = (url) => {
            let product = data.find(searchProduct=>searchProduct.name === url.slice(9));
            if (product !== undefined) {
                return product
            }
        };
        res.writeHead(200);
        res.end(JSON.stringify(search(req.url)));
    }
};

const server = http.createServer(requestListener);
fs.readFile(__dirname + "/products.json")
    .then(contents => {
        indexJsonFile = contents;
        server.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        });
    })
    .catch(err => {
        console.error(`Could not read products.json file: ${err}`);
        process.exit(1);
    });