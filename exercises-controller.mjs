import 'dotenv/config';
import express from 'express';
import * as exercises from './exercises-model.mjs';

const PORT = process.env.PORT;
const app = express();
app.use(express.json());


// CREATE controller ******************************************
app.post ('/exercises', (req,res) => { 
    exercises.createExercise(
        req.body.name, 
        req.body.reps, 
        req.body.weight,
        req.body.unit,
        req.body.date
        )
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error: 'Creation of a exercise failed due to invalid syntax.' });
        });
});

// GET all workouts 
app.get('/exercises', (req, res) => {
    // let allExercises = {};
    // exercises.readExercises(allExercises, '', 0)
    exercises.readExercises()
        .then(exercises => {
            res.send(exercises);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request to retrieve exercises failed' });
        });
});

// RETRIEVE controller ****************************************************
// GET exercises by ID
app.get('/exercises/:_id', (req, res) => {
    const exerciseID = req.params._id;
    exercises.findExerciseByID(exerciseID)
        .then(exercise => { 
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({ Error: 'Exercise not found' });
            }         
         })
         .catch(error => {
            res.status(404).json({ Error: 'Request to retrieve exercise failed' });
            // console.error(error);
            // res.send({ Error: 'Request to retrieve exercise failed' });
        });

});

// Update exercises by using PUT and ID
app.put('/exercises/:_id', (req, res) => {
    exercises.updateExercise(
        req.params._id,
        req.body.name, 
        req.body.reps, 
        req.body.weight,
        req.body.unit,
        req.body.date
    )
    .then(exercise => {
        // res.json({
        //             _id: req.params._id,
        //             name: req.body.name, 
        //             reps: req.body.reps, 
        //             weight: req.body.weight,
        //             unit: req.body.unit,
        //             date: req.body.date
        //         });
        res.json(exercise);
        // if(numUpdated === 1){
        //     res.json({
        //         _id: req.params._id,
        //         name: req.body.name, 
        //         reps: req.body.reps, 
        //         weight: req.body.weight,
        //         unit: req.body.unit,
        //         date: req.body.date
        //     })
        // }
        // else{
        //     res.status(404).json({Error: 'Resource not found'})
        // }
    })
    .catch(error => {
        console.error(error);
        res.send({ error: 'Request to update an exercise failed' });
    });

});

// DELETE Controller ******************************
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteByID(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } 
            else {
                res.status(404).json({ Error: 'Exercise not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request to delete an exercise failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});