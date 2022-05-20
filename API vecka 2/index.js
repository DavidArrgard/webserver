let app = require("express")();
app.listen(3000);
console.log("Servern ligger på port 3000")

app.get("/", function(req, res){
    res.sendfile(__dirname + "/index.html");
});

const { createConnection } = require("mysql");
const mysql = require("mysql"); 
con = mysql.createConnection({
    host: "localhost",     
    user: "root",     
    password: "",
    database: "api2"
});

const COLUMNS = ["id", "firstname", "lastname"]


app.get("/api", function(req, res) {
    let sql = "SELECT * FROM api";
    let connect = createCon(req.query);
    console.log(sql+connect);
    con.query(sql + connect, function(err, result, fields) {
        res.send(result);
    });
});


let createCon = function(query) {
    let output = " WHERE ";
    for (let key in query) {
        if (COLUMNS.includes(key)) {
            output += `${key}="${query[key]}"`;
            return output;
        }
    }
    return "";
}

app.get("/api/:id", function(req, res) {
    let sql = "SELECT * FROM api WHERE id=" + req.params.id;
    con.query(sql, function(err, result, fields) {
        if (result.length > 0){
            res.send(result);
        }
        else{
            res.sendStatus(404);
        }
    });
});