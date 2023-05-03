require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const TrainerModel = require("./models/Trainer")
const ClientModel = require("./models/Client")

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
        const trainer = await TrainerModel.findOne({email: req.body.email})
        if (trainer) {
            const userPassword = trainer.password
            const requestPassword = req.body.password
            if (validatePassword(userPassword, requestPassword)) {
                return res.status(202).send({id: trainer._id})
            } else {
                return res.status(406).send({error: 'Wrong password'})
            }
        } else {
            return res.status(406).send({error: 'User not found'})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error')
    }
})

app.get('/trainer/clients/:id', async (req, res) => {
    try {
        const trainerId = req.params.id
        const clients = await ClientModel.find({ trainerId: trainerId})
        if (clients) {
            return res.status(200).send(clients)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send('Internal Server Error')
    }
})

// app.post('/register', async (req, res) => {
//     try {
//
//     }
// })
