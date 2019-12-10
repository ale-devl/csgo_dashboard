const servers = require("./servers.json");
const Gamedig = require("gamedig");

class QueryError extends Error {
    constructor(code, ...params) {
        super(...params);
        this.code = code;
    }
}

async function QueryServer(server) {
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
        let oServer = servers[sServer];
        if (oServer) {
            return await QueryServer(oServer);
        } else {
            throw new QueryError(404, `Server not found: ${sServer}`);
        }
    }

    async restartServer (sServer) {
        let oServer = servers[sServer];
        if (oServer) {
            return await http.get({
                host: `localhost:${oServer.LGSMHandlerPort}`,
                path: "/restart"
            }, response => {
                return response;
            });
        }
    }

    async forceUpdateServer(sServer) {
        let oServer = servers[sServer];
        if (oServer) {
            return await http.get({
                host: `localhost:${oServer.LGSMHandlerPort}`,
                path: "/update"
            }, response => {
                return response;
            });
        }
    }
    };

module.exports = new ServerManager();