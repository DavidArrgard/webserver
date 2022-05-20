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
    database: "api",
    multipleStatements: true
});

app.use(express.json());

const crypto = require("crypto");
function hash(data) {
    const hash = crypto.createHash("sha256");
    hash.update(data);
    return hash.digest("hex");
}

const jwt = require("jsonwebtoken");

app.post("/login", function(req, res) {

    // kod för att validera input
    if (!req.body.firstname || !req.body.lastname || !req.body.nickname || !req.body.passwrd) {
        res.status(422).send("Se till att all obligatorisk information finns med. {firstname, lastname, nickname, passwrd}!");
        return;
    }

    let sql = `SELECT * FROM persons WHERE nickname='${req.body.nickname}'`

    con.query(sql, function(err, result, fields) {
        if (err) throw err;
        let passwordHash = hash(req.body.passwrd);
        if (result[0].passwrd == passwordHash) {
            //Denna kod skapar en token att returnera till anroparen.
            let payload = {
                id: result[0].id,
                sub: result[0].nickname,      //sub är obligatorisk
                name: result[0].firstname,   //Valbar information om användaren
                lastname: result[0].lastname
            }
            let token = jwt.sign(payload, "UsersHemlighetSomIngenKanGissaXyz123%&/");
            res.json(token);
        }
        else {
            res.sendStatus(401);
        }
    });
});

app.post("/users", function(req, res) {
    let authHeader = req.headers['authorization']
    if (authHeader === undefined) {
        res.sendStatus(400);
        return;
    }
    let token = authHeader.slice(7)
    console.log(token);
    
    let decoded;
    try {
        decoded = jwt.verify(token, "UsersHemlighetSomIngenKanGissaXyz123%&/")
    } catch (err) {
        try {
            decoded = jwt.verify(token, "AdminsHemlighetSomIngenKanGissaXyz123%&/")
        } catch (err) {
            console.log(err) //Logga felet, för felsökning på servern.
            res.status(401).send("Invalid auth token")
            return;
        }
    }

    // kod för att validera input
    if (!req.body.firstname || !req.body.lastname || !req.body.nickname || !req.body.passwrd) {
        res.status(422).send("Se till att all obligatorisk information finns med. {firstname, lastname, nickname, passwrd}!");
        return;
    }
    
    let sql = `INSERT INTO persons (firstname, lastname, nickname, passwrd)
    VALUES ('${req.body.firstname}', 
    '${req.body.lastname}',
    '${req.body.nickname}',
    '${hash(req.body.passwrd)}');
    SELECT LAST_INSERT_ID();`;
    console.log(sql);
    
    con.query(sql, function(err, result, fields) {
        if (err) throw err;
        console.log(result);
        let output = {
            id: req.body.id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            nickname: req.body.nickname
        }   // OBS: bäst att INTE returnera lösenordet
        res.send(output);
    });
});

app.put("/users/:id", function(req, res) {
    let authHeader = req.headers['authorization']
    if (authHeader === undefined) {
        res.sendStatus(400);
        return;
    }
    let token = authHeader.slice(7)
    console.log(token);
    
    let decoded
    try {
        decoded = jwt.verify(token, "UsersHemlighetSomIngenKanGissaXyz123%&/");
        console.log(`Inloggad som ${decoded.sub}`);
        if (decoded.id != Number(req.params.id)) {
            res.status(401).send("Ej behörig! (se till att använda personens ID vid ändringar)")
            return;
        }
    } catch (err) {
        try {
            decoded = jwt.verify(token, "AdminsHemlighetSomIngenKanGissaXyz123%&/")
        } catch (err) {
            console.log(err) //Logga felet, för felsökning på servern.
            res.status(401).send("Invalid auth token")
            return;
        }
    }

    // kod för att validera input
    if (!req.body.firstname || !req.body.lastname || !req.body.nickname || !req.body.passwrd) {
        res.status(422).send("Se till att all obligatorisk information finns med. {firstname, lastname, nickname, passwrd}!");
        return;
    }

    let sql = `UPDATE persons `;
    sql += `SET firstname = '${req.body.firstname}', lastname = '${req.body.lastname}', nickname = '${req.body.nickname}', passwrd = '${hash(req.body.passwrd)}'`;
    sql += ` WHERE id = ${Number(req.params.id)}`;
    console.log(sql);

    con.query(sql, function(err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Fel i databasanropet!");
            throw err;
        }
        res.status(200).send(); // OK
    });
});

app.get("/users/:id", function(req, res) {
    let authHeader = req.headers['authorization']
    if (authHeader === undefined) {
        res.sendStatus(400);
        return;
    }
    let token = authHeader.slice(7)
    console.log(token);
    
    let decoded
    try {
        decoded = jwt.verify(token, "UsersHemlighetSomIngenKanGissaXyz123%&/");
        console.log(`Inloggad som ${decoded.sub}`);
        console.log(decoded.id, Number(req.params.id))
        if (decoded.id == Number(req.params.id)) {
        } else {
            res.status(401).send("Bra försök, men det är inte du! HA! (se till att du har sökt på ID't av personen.")
            return;
        }
    } catch (err) {
        try {
            decoded = jwt.verify(token, "AdminsHemlighetSomIngenKanGissaXyz123%&/")
        } catch (err) {
            console.log(err) //Logga felet, för felsökning på servern.
            res.status(401).send("Invalid auth token")
            return;
        }
    }
    let sql = `SELECT * FROM persons WHERE id = ${Number(req.params.id)}`;
    console.log(sql)
    
    con.query(sql, function(err, result, fields) {
        res.send(result);
    });
});

app.get("/users", function(req, res) {
    let authHeader = req.headers['authorization']
    if (authHeader === undefined) {
        res.sendStatus(400);
        return;
    }
    let token = authHeader.slice(7)
    console.log(token);
    
    let decoded;
    try {
        decoded = jwt.verify(token, "AdminsHemlighetSomIngenKanGissaXyz123%&/");
    } catch (err) {
        console.log(err); //Logga felet, för felsökning på servern.
        res.status(401).send("YOU ARE NOT ADMIN, NICE TRY! HAHA! NOOOB!");
        return;
    }

    let sql = "SELECT firstname, lastname, nickname, id FROM persons";
    
    con.query(sql, function(err, result, fields) {
        res.send(result);
    });
});