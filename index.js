const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aunadi8.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const database = client.db("productDB").collection("products");


        app.get("/", (req, res) => {
            res.send("hello");
        })

        app.get("/data", async (req, res) => {
            const cursor = database.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post("/data", async (req, res) => {
            const data = req.body;
            const result = await database.insertOne(data);
            res.send(result);
        })

        app.delete("/data/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await database.deleteOne(query);
            res.send(result);
        })

        app.get("/data/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await database.findOne(query);
            res.send(result);
        })

        app.put('/data/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log(id, data);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updatedData = {
                $set: {
                    image: data.image,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    stock: data.stock,
                }
            }
            const result = await database.updateOne(filter, updatedData, options);
            res.send(result);
        })

        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`the ap is running on port ${port}`);
})