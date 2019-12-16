"use strict";
const express = require("express");
const yargs = require("yargs").argv;
const ServerManager = yargs.dev === "true" ? require("./ServerManagerMock") : require("./ServerManager");
const app = express();
const sPort = yargs.port || 1338;

app.get("/all", async (req, res) => {
    let aServers = await ServerManager.getServers();
    aServers = aServers.map(server => {
        return processData(server);
    });
    res.json(aServers);
});

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
        console.log("Restarting");
        await ServerManager.restartServer(sServer);
        res.status(200).send();
    } catch (error) {
        res.status(404).send();
    }
});

app.get("/:server/update", async (req, res) => {
    let sServer = req.params.server;
    try {
        await ServerManager.updateServer(sServer);
        res.status(200).send();
    } catch (error) {
        res.status(404).send();
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
        "id": server.metadata.id,
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
        "playerCount": `${server.data.raw.numplayers + server.data.raw.numbots}/${server.data.maxplayers}`,
        "version": server.data.version,
        "connect": `steam://connect/${server.data.connect}`,
        "status": "up"
    };
    return oData;
};