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

app.post('/users', function(req, res) {

    if (isValidUserData(req.body)) { 
        let sql = `INSERT INTO users (firstname, lastname, userID, passwd) 
        VALUES ('${req.body.firstname}',
        '${req.body.lastname}',
        '${req.body.userID}',
        '${req.body.passwd}');
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
                userID: req.body.userID,
                passwd: req.body.passwd
            };
            res.json(output);
        });
    } else {
        res.status(422).send("userId required!");
    }
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