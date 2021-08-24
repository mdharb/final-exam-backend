const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const server = express();

server.use(cors());

server.use(express.json());

PORT = process.env.PORT || 3001

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/flowers", { useNewUrlParser: true, useUnifiedTopology: true });


const flowersSchema = new Schema({
    email: String,
    instructions: String,
    photo: String,
    name: String
})

const flowerModel = mongoose.model('flowers', flowersSchema);

function getDataHandler(req, res) {
    const url = "https://flowers-api-13.herokuapp.com/getFlowers"
    axios.get(url).then((result) => {
        const flowersArray = result.data.flowerslist.map((flowers) => {
            return new Flower(flowers);
        });
        res.send(flowersArray);
    });
}

function postDataHandler(req, res) {
    const { email,instructions, photo, name } = req.body;
    const newFlower = new flowerModel({
        email,
        instructions,
        photo,
        name
    });
    newFlower.save();
}

function deleteDataHandler(req, res) {
    const id = req.params.id;
    flowerModel.deleteOne({ _id: id }, (err, result) => {
        flowerModel.find({}, (err, newResult) => {
            res.send(newResult);
        });
    });
}

function putDataHandler(req, res) {
    const id = req.params.id;
    const { email,instructions, photo, name } = req.body;
    flowerModel.findOne({}, (err, result) => {
        email = result.email;
        instructions = result.instructions;
        photo = result.photo;
        name = result.name;
        result.save().then(() => {
            flowerModel.find({}, (err, newResult) => {
                res.send(newResult)
            });
        });
    });

}

function getDataFromServerHandler(req, res){
    flowerModel.find({}, (err,result) => {
        res.send(result)
    });
}

server.get("/get-data", getDataHandler);
server.post("/post-data", postDataHandler);
server.delete("/delete-data/:id", deleteDataHandler);
server.put("/put-data/:id", putDataHandler);
server.get("/get-data-server",getDataFromServerHandler);

class Flower {
    constructor(flowers) {
        this.email = 'md20.harb21@gmail.com'
        this.instructions = flowers.instructions;
        this.photo = flowers.photo;
        this.name = flowers.name;
    }
}

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})