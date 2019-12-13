"use strict";
const servers = require("./servers.json");
const Gamedig = require("gamedig");
class QueryError extends Error {
    constructor(code, ...params) {
        super(...params);
        this.code = code;
    }
}

async function queryServer(server) {
    try {
        let oServerData = await Gamedig.query({
            type: server.type,
            host: server.host,
            port: server.port,
            maxAttempts: 10
        });
        return {
            metadata: server,
            data: oServerData
        };
    } catch (error) {
        if (error.message = "Error: Failed all 10 attempts") {
            throw new QueryError(1, "Server offline");
        }
    }
}

class ServerManager {
    async getData (sServer) {
        let oServer = getServerByName(sServer);
        if (oServer) {
            return await queryServer(oServer);
        } else {
            throw new QueryError(404, `Server not found: ${sServer}`);
        }
    }

    async restartServer (sServer) {
        let oServer = getServerByName(sServer);
        if (oServer) {
            return await http.get({
                host: `localhost:${oServer.LGSMHandlerPort}`,
                path: "/restart"
            }, response => {
                return response;
            });
        } else {
            return null;
        }
    }

    async forceUpdateServer(sServer) {
        let oServer = getServerByName(sServer);
        if (oServer) {
            return await http.get({
                host: `localhost:${oServer.LGSMHandlerPort}`,
                path: "/update"
            }, response => {
                return response;
            });
        } else {
            return null;
        }
    }

    getServers() {
        return servers;
    }
};

function getServerByName (name) {
    return servers.find(server => {
        return server.name === name;
    });
}

module.exports = new ServerManager();