const mongoose = require("mongoose")

const TrainerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    birthday: {type: Date},
    gender: {type: String},
    email: {type: String, required: true},
    city: {type: String},
    home_gym: {type: String},
    phone: {type: Number},
})

const TrainerModel = mongoose.model("Trainers", TrainerSchema)

module.exports = TrainerModel