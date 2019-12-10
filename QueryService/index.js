"use strict";
const express = require("express");
const yargs = require("yargs").argv;
const ServerManager = yargs.dev === "true" ? require("./ServerManagerMock") : require("./ServerManager");
const app = express();
const sPort = yargs.port || 1338;

app.get("/:server/query", async (req, res) => {
    let sServer = req.params.server;
    try {
        let oRawServerData = await ServerManager.getData(sServer);
        let oProcessedData = processData(oRawServerData);
        res.json(oProcessedData);
    } catch (error) {
        if (error.code === 1) {
            res.status(504).send(`${sServer} appears to be offline`);
        } else {
            res.json(error.message);
        }
    }
});

app.get("/:server/restart", async (req, res) => {
    let sServer = req.params.server;
    try {
        await ServerManager.restart(sServer);
        res.status(200);
    } catch (error) {
        res.status(404);
    }
});

app.get("/:server/update", async (req, res) => {
    let sServer = req.params.server;
    try {
        await ServerManager.update(sServer);
        res.status(200);
    } catch (error) {
        res.status(404);
    }
});

app.listen(sPort, () => {
    console.log(`QueryService: Listening on port ${sPort}`);
    if (yargs.dev) {
        console.log("QueryService: Dev mode enabled. No real server data will be requested");
    }
});

function processData (server) {
    let oData = {
        "name": server.metadata.name,
        "description": server.metadata.description,
        "map": server.data.map,
        "players": {
            "count": server.data.raw.numplayers + server.data.raw.numBots,
            "max": server.data.maxplayers,
            "list": [
                {
                    "SomePlayer": {
                        "name": "",
                        "team": "",
                        "ping": 0,
                        "isBot": false,
                        "isAdmin": true
                    }
                }
            ]
        },
        "version": server.data.version,
        "connect": `steam://connect/${server.data.connect}`,
        "status": "up"
    };
    return oData;
};