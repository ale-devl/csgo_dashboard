"use strict";
const express = require("express")
const ServerManager = require("./ServerManager");
const app = express();
const sPort = 1339;

app.get("/:server/query", async (req, res) => {
    let sServer = req.params.server;
    try {
        let oServerData = await ServerManager.getData(sServer);
        res.json(oServerData);
    } catch (error) {
        if (error.code === 1) {
            res.status(504).send(`${sServer} appears to be offline`);
        } else {
            res.json(error.message);
        }
    }
});

app.listen(sPort, () => {
    console.log(`Listening on port ${sPort}`);
});