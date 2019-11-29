const fork = require("child_process").fork;
const spawn = require('cross-spawn');
const yargs = require("yargs").argv;
const chalk = require('chalk');

const Modules = {
    "Proxy": {
        "path": "./Proxy/index.js",
        "method": "fork",
        "args": ["--port=1337"]
    },
    "QueryService": {
        "path": "./QueryService/index.js",
        "method": "fork",
        "args": ["--port=1338"]
    },
    "UI5app": {
        "path": "./UI5app",
        "method": "spawn",
        "args": ["serve-dist"],
        "devArgs": ["start"],
        "port": "1339"
    }
};

let oChildProcesses = {};

for (let [sModule, oValue] of Object.entries(Modules)) {
    let args;
    switch (oValue.method) {
        case "fork":
            args = oValue.args;
            if (yargs.dev) {
                args.push("--dev=true");
            }
            oChildProcesses[sModule] = fork(oValue.path, args);
            break;
        case "spawn":
            if (yargs.dev) {
                args = oValue.devArgs;
                args.push(`-p=${oValue.port}`)
            } else {
                args = oValue.args;
                args.push(`--port ${oValue.port}`);
            }
            args.push(oValue.port);
            spawn("yarn", args, {cwd: oValue.path, stdio: "inherit"});
            break;
    }
}

let sUrl = "http://localhost:1337/dashboard";
if (yargs.dev) {
    sUrl += "/index.html";
}

console.log(chalk.bgRed(`Processes started. URL: ${sUrl}`));