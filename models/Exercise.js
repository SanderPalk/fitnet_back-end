const mongoose = require("mongoose")
const {ObjectId, Double} = require("mongodb");

const ExerciseSchema = new mongoose.Schema({
    workoutId: {type: ObjectId, required: true},
    exerciseName: {type: String, required: true},
    sets: [{
        weight: String,
        reps: Number
    }]
})

const ExerciseModel = mongoose.model("Exercises", ExerciseSchema)

module.exports = ExerciseModel