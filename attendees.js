const { Client } = require('pg');
const express = require("express");
const { request, response } = require('express');
const { json } = require('body-parser');
const { Console } = require('console');

app = express();
app.use(express.json());
app.use(express.urlencoded( {extended: true}));

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'reservationsdemo',
    user: 'postgres',
    password: '65432',

});

client.connect()

app.delete("/attendees", (req, resp) => {
    console.log("In /attendees DELETE");
    resp.write("Please add the id at the path, eg attendees/21, in order to delet the id=21");
    resp.end();    
});
app.delete("/attendees/:id", (req, resp) => {
    console.log("In Att DELETE");
    const myQuery = {
        text: "DELETE FROM attendees WHERE id = $1",
        values: [req.params.id]
    }
    
    client
        .query(myQuery)
        .then(function (results) {
            console.log("Success!");
            console.log(results.rowCount);
            resp.writeHead(200, {
                "Content-Type": "text/json",
                "Access-Control-Allow-Origin": "*"
            });
            resp.write(JSON.stringify("ok"));
            resp.end();
        })
        .catch(function (err) {
            console.log("Oooops!");
            console.log(err);
            //"Content-Type" :"text/plain"
            resp.writeHead(200, {
                "Content-Type": "text/json",
                "Access-Control-Allow-Origin": "*"
            })
            resp.write(JSON.stringify("Faild!"));
            resp.end();
        })
});
app.get("/attendees/DELETE/:id", (req, resp) => {
    console.log("In /attendees/DELETE using GET");
   
    const myQuery = {
        text: "DELETE FROM attendees WHERE id = $1",
        values: [req.params.id]
    }

    client
        .query(myQuery)
        .then((resuits) => {
            console.log("Success!");
            console.log(resuits.rowCount);
            resp.writeHead(200, {
                "Content-Type": "text/json",
                "Access-Control-Allow-Origin": "*",
            });
            resp.write(JSON.stringify(req.params.id));
            resp.end();
        })
        .catch((error) => {
            console.log("Ooops!");
            console.log(error);
            resp.writeHead(200, {
                "Content-Type": "text/json",
                "Access-Control-Allow-Origin": "*",
            })
            resp.write(JSON.stringify("Failed"));
            resp.end();
        });
});



app.post("/attendees",(req, resp) => {
    console.log("In Att POST");
     
    const myQuery = {
        text: "INSERT INTO attendees (fullname, company, experience, email) VALUES ($1, $2, $3, $4)",
        values: [req.body.fullname, req.body.company, req.body.experience, req.body.email]
    }
    
    client
        .query(myQuery)
        .then(function (results) {
            console.log("Success!");
            console.log(results.rowCount);
            resp.writeHead(200, {
                "Content-Type": "text/json",
                "Access-Control-Allow-Origin": "*"
            });
            resp.write(JSON.stringify("ok"));
            resp.end();
        })
        .catch(function (err) {
            console.log("Oooops!");
            console.log(err);
            //"Content-Type" :"text/plain"
            resp.writeHead(200, {
                "Content-Type": "text/json",
                "Access-Control-Allow-Origin": "*"
            })
            resp.write(JSON.stringify("Faild!"));
            resp.end();
        }) 
});

function insertFromAPIEndpoint(req, resp) { 

    console.log("In /attendeess PUT using the POST (workaround)");


    // req.body.id
    const myQuery = {
        text: "UPDATE attendees SET fullname = $2, experience = $4, email = $5, company = $3 WHERE id = $1",
        values: [req.body.id, req.body.fullname, req.body.company, req.body.experience, req.body.email]
    }

    client
        .query(myQuery)
        .then((resuits) => {
            console.log("Success!");
            console.log(resuits.rowCount);
            resp.writeHead(200, {
                "Content-Type": "text/json",
                "Access-Control-Allow-Origin": "*",
            });
            resp.write(JSON.stringify("ok"));
            resp.end();
        })
        .catch((error) => {
            console.log("Ooops!");
            console.log(error);
            resp.writeHead(200, {
                "Content-Type": "text/json",
                "Access-Control-Allow-Origin": "*",
            })
            resp.write(JSON.stringify("Failed"));
            resp.end();
        });
    }
    app.post("/attendees/PUT/", insertFromAPIEndpoint);
    app.put("attendees", insertFromAPIEndpoint);


app.get("/attendees", (req, resp) => {
   //variablename = (condition) ? value1 (true):value2 (false) 
   let filterName = req.query.filterName ? req.query.filterName : "";

    const myQuery = {
        text: "SELECT * FROM attendees WHERE UPPER(fullname) LIKE UPPER($1)",
        values: ["%" + filterName + "%"]
    }
    console.log("SELECT * FROM attendees WHERE fullname LIKE '%" + filterName + "%'")
    
    
    client
        .query(myQuery)
        .then(function (results) {
            console.log("Success!");
            console.log(results.rowCount);
            resp.writeHead(200, {
                "Content-Type": "text/json",
                "Access-Control-Allow-Origin": "*"
            });
            resp.write(JSON.stringify(results.rows));
            resp.end();
        })
        .catch(function (err) {
            console.log("Oooops!");
            console.log(err);
            //"Content-Type" :"text/plain"
            resp.writeHead(200, {
                "Content-Type": "text/json",
                "Access-Control-Allow-Origin": "*"
            })
            resp.write(JSON.stringify("Faild!"));
            resp.end();
        })
});

app.get("/", (req, resp) => {
    resp.write("In GET");
    resp.end();
});

app.listen(3000, function () { console.log("Server started and listening to port 3000"); });
