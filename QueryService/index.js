// const Gamedig = require('gamedig');
// const App = require("express")();
// const port = 1338;
// Gamedig.query({
//     type: 'csgo',
//     host: '185.163.119.91',
//     port: '27015'
// }).then((state) => {
//     console.log(state);
// }).catch((error) => {
//     console.log("Server is offline");
// });

const app = require("express")();
const sPort = 1339;

app.get("/practice/query", (req, res) => {
    res.json({
        status: "Running",
        playerCount: "0/32",
        map: "de_stroyed"
    });
});


app.get("/fooserver/query", (req, res) => {
    res.json({status: "success /"});
});

app.listen(sPort, () => {
    console.log(`Listening on port ${sPort}`);
});