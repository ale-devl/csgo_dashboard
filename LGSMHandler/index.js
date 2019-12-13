"use strict";
const express = require("express");
const app = express();
const oSettings = require("./settings.json");
const shell = require('shelljs');
const validCommands = {
    "restart": {
        enabled: true
    },
    "update": {
        enabled: true
    }
};

if (!oSettings.port) {
    console.error("No port specified");
    process.exit(0);
}

app.get("/restart", async (req, res) => {
    await sendCommand("restart");
    res.send(200);
});

app.get("/update", async (req, res) => {
    await sendCommand("force-update");
    res.send(200);
});

app.listen(oSettings.port, () => {
    console.log(`LGSMHandler: Listening on port ${oSettings.port}`);
});

async function sendCommand (sCommand) {
    if (validCommands[sCommand]) {
        return await shell.exec(`${oSettings.path} ${sCommand}`, {async:true});
    } else {
        console.error("wat doink");
        return;
    }
}