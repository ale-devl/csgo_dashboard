const Gamedig = require('gamedig');
Gamedig.query({
    type: 'csgo',
    host: '185.163.119.91',
    port: '27015'
}).then((state) => {
    console.log(state);
}).catch((error) => {
    console.log("Server is offline");
});