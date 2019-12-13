"use strict";
const servers = require("./servers.json");

class QueryError extends Error {
    constructor(code, ...params) {
        super(...params);
        this.code = 1;
    }
}

async function queryServer(server) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(
                {
                    metadata: server,
                    data: {
                        "name": "Mocked Server",
                        "map": "de_mock",
                        "password": true,
                        "raw": {
                            "protocol": 17,
                            "folder": "csgo",
                            "game": "Counter-Strike: Global Offensive",
                            "steamappid": 730,
                            "numplayers": 0,
                            "numbots": 0,
                            "listentype": "d",
                            "environment": "l",
                            "secure": 1,
                            "version": "1.37.2.6",
                            "tags": "empty,secure",
                            "gameid": "730",
                            "rules": {}
                        },
                        "maxplayers": 32,
                        "players": [],
                        "bots": [],
                        "connect": "185.163.119.91:27015",
                        "ping": 6
                    }
                });
        }, 2000);
    });
}

class ServerManager {
    /**
     * Gets the data from the running instance
     *
     * @param {String} sServer The identifier of the server
     * @throws {QueryError} Exception is thrown if no server is running with the given identifier
     */
    async getData (sServer) {
        let oServer = servers.find(server => {
            return server.name === sServer;
        });
        if (oServer) {
            return await queryServer(oServer);
        } else {
            throw new QueryError(2, `Server not found: ${sServer}`);
        }
    }

    /**
     * Restarts a sever instance
     *
     * @param {String} sServer The identifier of the server
     */
    async restartServer (sServer) {
        setTimeout(() => {
            return;
        }, 2000);
    }

    /**
     * Gracefully updates a server. Note: This CAN fail to fetch the newest version. Not sure why
     *
     * @param {String} sServer The identifier of the server
     */
    async forceUpdateServer (sServer) {
        setTimeout(() => {
            return;
        }, 2000);
    }

    getServers() {
        return servers;
    }
};

module.exports = new ServerManager();