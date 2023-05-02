require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const TrainerModel = require("./models/Trainer")

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

async function saveTrainer() {
    try {
        const trainer = new TrainerModel({
            name: "Sander",
            password: "qwerty123",
            birthday: new Date("2000-11-03"),
            gender: "Male",
            email: "sander.palk@voco.ee",
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
