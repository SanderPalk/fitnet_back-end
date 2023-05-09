require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const TrainerModel = require("./models/Trainer")
const ClientModel = require("./models/Client")
const WorkoutModel = require("./models/Workouts")
const ExerciseModel = require("./models/Exercise")

const corsOptions = {
    origin: ['http://localhost:3000', process.env.APP_URI]
}

const app = express()

app.use(cors(corsOptions))

mongoose.connect(process.env.DB_URI)
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server Listening on port ${port}`)
})

async function saveTrainer() {
    try {
        const trainer = new TrainerModel({
            name: "Admin",
            password: "qwerty123",
            birthday: new Date("2000-11-03"),
            gender: "Male",
            email: "admin@fitnet.ee",
            city: "Tartu",
            home_gym: "Tartu GYM!",
            phone: "595959555"
        })
        console.log(trainer)
        await trainer.save()
    } catch (e) {
        console.log(e.message)
    }
}

async function saveClient() {
    try {
        const client = new ClientModel({
            name: 'Arnold',
            password: 'password12311',
            birthday: new Date("1947-06-30"),
            gender: "Male",
            email: "arnold@client.fit",
            city: "Berlin",
            home_gym: "Sparta",
            phone: "1337",
            trainerId: '644faf4484fe1969b0782942'
        })
        await client.save()
    } catch (e) {
        console.log(e.message)
    }
}

async function saveWorkout() {
    try {
        const workout = new WorkoutModel({
            userId: '64524f8dc3271a3d43b185e0',
            date: new Date("2023-05-16")
        })
        await workout.save()
    } catch (e) {
        console.log(e.message)
    }
}

async function saveExercise() {
    try {
        const exercise = new ExerciseModel({
            workoutId: '6459014383f9cd4e5c17269e',
            exerciseName: 'Lift Red Bull can',
            sets: [
                {
                    weight: 2.5,
                    reps: 300
                },
                {
                    weight: 5,
                    reps: 200
                }
                ]
        })
        await exercise.save()
    } catch (e) {
        console.log(e.message)
    }
}

app.get('/trainers/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const trainer = await TrainerModel.findOne({_id: id});
        if (!trainer) {
            return res.status(404).send('Trainer not found');
        }
        return res.status(200).json(trainer);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
})

app.put('/trainers/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedFields = {
            name: req.body.name,
            birthday: req.body.birthday,
            email: req.body.email,
            phone: req.body.phone,
            gender: req.body.gender,
            city: req.body.city,
            home_gym: req.body.home_gym
        };
        Object.keys(updatedFields).forEach(key => {
            if (!updatedFields[key]) {
                delete updatedFields[key];
            }
        });
        await TrainerModel.findOneAndUpdate({_id: id}, updatedFields, {new: true});
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
});

function validatePassword(thePassword, validatingPassword) {
    if (thePassword === validatingPassword) {
        return true;
    }
}

app.post('/login', async (req, res) => {
    try {
        const requestPassword = req.body.password
        const client = await ClientModel.findOne({email: req.body.email})
        if (client) {
            if (validatePassword(client.password, requestPassword)) {
                return res.status(202).send({id: client._id})
            } else {
                return res.status(401).send({error: 'Wrong password'})
            }
        }
        const trainer = await TrainerModel.findOne({email: req.body.email})
        if (trainer) {
            if (validatePassword(trainer.password, requestPassword)) {
                return res.status(202).send({id: trainer._id})
            } else {
                return res.status(401).send({error: 'Wrong password'})
            }
        } else {
            return res.status(404).send({error: 'User not found'})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error')
    }
})

app.get('/trainer/clients/:id', async (req, res) => {
    try {
        const trainerId = req.params.id
        const clients = await ClientModel.find({trainerId: trainerId})
        if (clients) {
            return res.status(200).send(clients)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send('Internal Server Error')
    }
})

app.get('/schedule/:id', async (req, res) => {
    try {
        const trainerId = req.params.id
        const workouts = []
        const clients = await ClientModel.find({trainerId: trainerId})
        for (const client of clients) {
            const clientWorkouts = await WorkoutModel.find({userId: client._id})
            for (const clientWorkout of clientWorkouts) {
                const workoutWithClientName = {
                    ...(await clientWorkout).toObject(),
                    userName: client.name
                }
                workouts.push(workoutWithClientName)
            }
        }
        const trainerWorkouts = await WorkoutModel.find({userId: trainerId})
        for (const trainerWorkout of trainerWorkouts) {
            const trainerWorkoutWithTag = {
                ...(await trainerWorkout).toObject(),
                userName: 'Me'
            }
            workouts.push(trainerWorkoutWithTag)
        }
        return res.status(200).send(workouts)
    } catch (error) {
        console.log(error)
        return res.status(500).send('Internal Server Error')
    }
})

app.post('/add-workout', async (req, res) => {
    try {
        await WorkoutModel.create({
            userId: req.body.userId,
            date: new Date(req.body.date),
            description: req.body.description
        })
        return res.status(200).send('New workout added')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Internal Server Error')
    }
})

app.delete('/delete-workout=:workoutID', async (req, res) => {
    try {
        await WorkoutModel.findByIdAndDelete(req.params.workoutID)
        return res.status(200).send('Workout deleted')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Internal Server Error')
    }

})

app.get('/get-exercises/:workoutId', async (req, res) => {
    try {
        const exercises = await ExerciseModel.find({workoutId: req.params.workoutId})
        if (!exercises) {
            return res.status(404).send('Exercises not found');
        }
        console.log(exercises)
        return res.status(200).json(exercises);
    } catch (error) {
        console.log(error)
        return res.status(500).send('Internal Server Error')
    }
})

app.put('/remove_client/:trainerId/:id', async (req, res) => {
    try {
        const updatedFields = {
            trainerId: null
        };

        const updatedClient = await ClientModel.findOneAndUpdate({_id: req.params.id, trainerId: req.params.trainerId}, updatedFields, {new: true});
        return res.status(200).send(updatedClient)
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
});


app.post('/register', async (req, res) => {
    try {
        const client = new ClientModel({
            name: req.body.name,
            password: req.body.password,
            birthday: new Date("1947-06-30"),
            gender: "",
            email: req.body.email,
            city: "",
            home_gym: "",
            phone: req.body.phone,
            trainerId: null
        });
        await client.save();
        res.status(200).send(client);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to register an account.");
    }
});

