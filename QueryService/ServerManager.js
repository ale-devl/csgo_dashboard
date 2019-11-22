const servers = require("./servers.json");
const Gamedig = require("gamedig");

class QueryError extends Error {
    constructor(code, ...params) {
        super(...params);
        this.code = 1;
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
        return oServerData;
    } catch (error) {
        if (error.message = "Error: Failed all 10 attempts") {
            throw new QueryError("Server offline");
        }
    }
}

class ServerManager {
    async getData (sServer) {
        let oServer = servers[sServer];
        if (oServer) {
            return await QueryServer(oServer);
        } else {
            throw new QueryError(`Server not found: ${sServer}`);
        }
    }
};

module.exports = new ServerManager();