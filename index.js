const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 5000;

//Middleware 
app.use(cors());
app.use(bodyParser.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.unku5v2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{

        await client.connect();
        const productCollection = client.db('productAnalysis').collection('products');

        //GET database to client
        app.get('/products', async(req, res)=> {
            const query = {};
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });


        //POST client to database
        app.post('/product', async (req,res)=> {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        });


        //DELETe from database and client
        app.delete('/product/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });

        //UPDATE use id catch
        app.get('/product/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.findOne(query);
            res.send(result);
        });

        //UPDATE product 
        app.put('/product/:id', async(req, res)=> {

            const id = req.params.id;
            const updateProduct = req.body;
            const filter = {_id: ObjectId(id)};
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateProduct.name,
                    price: updateProduct.price
                },
            };
            const result = await productCollection.updateOne(filter, updateDoc, option);

            res.send(result);
        });

    }

    finally{

    }


};
run().catch(console.dir);


app.listen(port, ()=> {
    console.log('Node server running ', port);
});


