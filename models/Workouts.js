const mongoose = require("mongoose")
const {ObjectId} = require("mongodb");

const WorkoutsSchema = new mongoose.Schema({
    userId: {type: ObjectId, required: 'true'},
    date: {type: Date, required: true}
})

const WorkoutModel = mongoose.model("Workouts", WorkoutsSchema)

module.exports = WorkoutModel