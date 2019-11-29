// Dependencies
const express = require('express');
const proxy = require('http-proxy-middleware');
const yargs = require("yargs").argv;

// Config
const { routes } = require('./routes.json');
const sPort = yargs.port || "1337";

const app = express();

for (route of routes) {
    app.use(route.route,
        proxy({
            target: route.address,
            pathRewrite: (path, req) => {
                return path.split('/').slice(2).join('/');
            }
        })
    );
}

app.listen(sPort, () => {
    console.log(`Proxy: Listening on port ${sPort}`);
});