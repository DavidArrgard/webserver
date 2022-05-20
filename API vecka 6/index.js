let express = require("express");
let app = express();
app.listen(3000);
console.log("Servern körs på port 3000");

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

const mysql = require("mysql");
con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "api2",
    multipleStatements: true
});

app.use(express.json());

const crypto = require("crypto"); //INSTALLERA MED "npm install crypto" I KOMMANDOTOLKEN
function hash(data) {
    const hash = crypto.createHash("sha256");
    hash.update(data);
    return hash.digest("hex");
}


app.post('/users', function(req, res) {

    if (isValidUserData(req.body)) { 
        let sql = `INSERT INTO users (firstname, lastname, userID, passwd) 
        VALUES ('${req.body.firstname}',
        '${req.body.lastname}',
        '${req.body.userID}',
        '${hash(req.body.passwd)}');
        SELECT LAST_INSERT_ID();`;
        console.log(sql);

        con.query(sql, function(err, result, fields) {
            if (err) {
                console.log(err);
                res.status(500).send("Fel i databasanropet!");
                throw err;
            }
            console.log(result);
            let output = {
                id: result[0].insertId,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                userID: req.body.userID
            };
            res.json(output);
        });
    } else {
        res.status(422).send("userId required!");
    }
});

app.post("/login", function(req, res) {
    let sql = `SELECT * FROM users WHERE userId='${req.body.userID}'`

    con.query(sql, function(err, result, fields) {
        if (err) throw err;
        let passwordHash = hash(req.body.passwd);
        console.log(passwordHash);
        console.log(result[0].passwd);
        if (result[0].passwd == passwordHash) {
            res.send({
                firstname: result[0].firstname, 
                lastname: result[0].lastname,
                userId: result[0].userID
            });
        }
        else {
            res.sendStatus(401);
        }
    });
});


app.put('/users/:id', function(req, res) {
    if (isValidUserData(req.body)) {
        let sql = `UPDATE users `;
        if (req.body.firstname && req.body.lastname) {
            sql += `SET firstname = '${req.body.firstname}', lastname = '${req.body.lastname}'`;
        }
        else {
            if (req.body.firstname) { 
                sql += `SET firstname = '${req.body.firstname}'`;
            }
            else {
                sql += `SET lastname = '${req.body.lastname}'`;
            }
        }
  	    sql += ` WHERE id = ${req.params.id}`;
        console.log(sql);

        con.query(sql, function(err, result, fields) {
            if (err) {
                console.log(err);
                res.status(500).send("Fel i databasanropet!");
                throw err;
            }
            res.status(200).send();
        });
    } else {
        res.status(422).send("Måste innehålla firstname eller lastname!");
    }
});

function isValidUserData(body) {
    return body && (body.firstname || body.lastname);
}