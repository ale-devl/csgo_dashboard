const servers = require("./servers.json");

class QueryError extends Error {
    constructor(code, ...params) {
        super(...params);
        this.code = 1;
    }
}

async function QueryServer(server) {
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
        }, 2000)}
    );
}

class ServerManager {
    async getData (sServer) {
        let oServer = servers[sServer];
        if (oServer) {
            return await QueryServer(oServer);
        } else {
            throw new QueryError(2, `Server not found: ${sServer}`);
        }
    }
};

module.exports = new ServerManager();