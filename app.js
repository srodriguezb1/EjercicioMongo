const MongoClient = require("mongodb").MongoClient;

const express = require("express");

let app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

var conn = MongoClient.connect("mongodb://localhost:27017",
{useNewUrlParser:true, useUnifiedTopology:true});
function getCountry(callback, pais){
conn.then(client =>{

    client.db("prueba").collection("countries").find({country:pais}).toArray((err, data)=>{
        callback(data);
    });
});
};

function getAll(callback){
    conn.then(client =>{
    
        client.db("prueba").collection("countries").find({}).toArray((err, data)=>{
            callback(data);
        });
    });
};

function write(callback, data){
    conn.then(client =>{
        client.db("prueba").collection("countries").insertOne(data,(info)=>{
            callback(info);
        });
    });
};


function update(callback, name, cambios ){
    conn.then(client =>{
    
        client.db("prueba").collection("countries").updateOne({country:name},{$set:{population:cambios.population,continent:cambios.continent, lifeExpectancy:cambios.lifeExpectancy, purchasingPower:cambios.purchasingPower}},(data)=>{
            callback(name, data);
        });
    });
};

function borrar(callback,name)
{
    conn.then(client =>{
    
        client.db("prueba").collection("countries").deleteOne({country:name},(info)=>{
            callback(info);
        });
    });
};


app.get("/countries", (req,res)=>{

    getAll((data)=>{
        res.json(data);
    });
});

app.get("/countries/:name", (req,res)=>{

    var id = req.params.name;

    getCountry((data)=>{
        res.json(data);
    }, id);
});

app.post("/countries", (req, res)=>{
    console.log(req.body);
    write((data)=>{
        res.json(data);
    },req.body);

});

app.put("/countries/:name",(req,res)=>{

    var id = req.params.name;
    console.log(req.body);
    update((data)=>{
        res.json(data);
    }, id, req.body);

});

app.delete("/countries/:name",(req,res)=>{
    var id = req.params.name;
    borrar((data)=>{
        res.json(data);
    }, id);
});

app.listen(8080);