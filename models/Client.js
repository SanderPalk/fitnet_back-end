const mongoose = require("mongoose")
const {ObjectId} = require("mongodb");

const ClientsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    birthday: {type: Date},
    gender: {type: String},
    email: {type: String, required: true},
    city: {type: String},
    home_gym: {type: String},
    phone: {type: Number},
    trainerId: {type: ObjectId, ref: 'Trainers'}
})

const ClientModel = mongoose.model("Clients", ClientsSchema)

module.exports = ClientModel