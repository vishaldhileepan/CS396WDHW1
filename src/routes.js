"use strict";

// const Companion = require("./schema/Companion");
// const Doctor = require("./schema/Doctor");

const express = require("express");
const router = express.Router();

router.route("/")
    .get((req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });

// ---------------------------------------------------
// Edit below this line
// ---------------------------------------------------

const data = require("../config/data.json");

router.route("/doctors")
    .get((req, res) => {
        console.log("GET /doctors");
        res.status(200).send(data.doctors)
    })
    .post((req, res) => {
        console.log("POST /doctors");
        if (req.body.name && req.body.seasons){
            var doc = {
                _id: `d${String(data.doctors.length+1)}`,
                name: req.body.name,
                seasons: req.body.seasons
            }
            data.doctors.push(doc)
            res.status(201).send(doc)
        }
        else {
            res.status(500).send({
                message: 'Missing data'
            })
        }
    });

router.route("/doctors/:id")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}`);
        const d1 = data.doctors.filter(doc => doc._id == req.params.id)
        if (d1.length === 0) {
            res.status(404).send({
                message:`Doctor with id ${req.params.id} does not exist`
            })
        }
        else{
            res.status(200).send(d1[0])
        }
    })
    .patch((req, res) => {
        console.log(`PATCH /doctors/${req.params.id}`);
        var name = null
        var seasons = null
        if (req.body.name){
            name = req.body.name
        }
        if (req.body.seasons){
            seasons = req.body.seasons
        }
        var idx = data.doctors.findIndex(doc => doc._id === req.params.id)
        if (name !== null){
            data.doctors[idx].name=name
        }
        if (seasons !== null){
            data.doctors[idx].seasons=seasons
        }
        res.status(200).send(data.doctors[idx])
    })
    .delete((req, res) => {
        console.log(`DELETE /doctors/${req.params.id}`);
        data.doctors = data.doctors.filter(doc => doc._id !== req.params.id)
        res.status(200).send({
            message: 'Deleted'
        })
    });

router.route("/doctors/:id/companions")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/companions`);
        // res.status(501).send();
        const d1 = data.companions.filter(comp => comp.doctors.includes(req.params.id))
        if (d1.length === 0) {
            res.status(404).send({
                message:`Doctor with id ${req.params.id} does not exist`
            })
        }
        else{
            res.status(200).send(d1)
        }
    });

// router.route("/doctors/:id/companions/longest")
//     .get((req, res) => {
//         console.log("GET /doctors/:id/companions/longest");
//         res.status(501).send();
//     });

router.route("/doctors/:id/goodparent")
    .get((req, res) => {
        console.log("GET /doctors/:id/goodparent");
        // res.status(501).send();
        const d1 = data.companions.filter(comp => comp.doctors.includes(req.params.id))
        if (d1.length === 0) {
            res.status(404).send({
                message:`Doctor with id ${req.params.id} does not exist`
            })
        }
        else{
            res.status(200).send(d1.every(comp => comp.alive === true))
        }
    });

router.route("/companions")
    .get((req, res) => {
        console.log("GET /companions");
        res.status(200).send(data.companions)
    })
    .post((req, res) => {
        console.log("POST /companions");
        if (req.body.name && req.body.seasons && req.body.character && req.body.doctors && req.body.alive){
            var comp = {
                _id: `c${String(Date.now())}`,
                name: req.body.name,
                character: req.body.character,
                doctors: req.body.doctors,
                seasons: req.body.seasons,
                alive: req.body.alive
            }
            data.companions.push(comp)
            res.status(201).send(comp)
        }
        else {
            res.status(500).send({
                message: 'Missing data'
            })
        }
    });

router.route("/companions/crossover")
    .get((req, res) => {
        console.log(`GET /companions/crossover`);
        const d1 = data.companions.filter(comp => comp.doctors.length > 1)
        res.status(200).send(d1)
    });

router.route("/companions/:id")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}`);
        const d1 = data.companions.filter(comp => comp._id == req.params.id)
        if (d1.length === 0) {
            res.status(404).send({
                message:`Companion with id ${req.params.id} does not exist`
            })
        }
        else{
            res.status(200).send(d1[0])
        }
    })
    .patch((req, res) => {
        console.log(`PATCH /companions/${req.params.id}`);
        var name = null
        var character = null
        var doctors = null
        var seasons = null
        var alive = null
        if (req.body.name){
            name = req.body.name
        }
        if (req.body.character){
            character=req.body.character
        }
        if (req.body.seasons){
            seasons = req.body.seasons
        }
        if (req.body.doctors){
            doctors=req.body.doctors
        }
        if (req.body.alive){
            alive=req.body.alive
        }
        var idx = data.companions.findIndex(comp => comp._id === req.params.id)
        if (name !== null){
            data.companions[idx].name=name
        }
        if (character !== null){
            data.companions[idx].character=character
        }
        if (seasons !== null){
            data.companions[idx].seasons=seasons
        }
        if (doctors !== null){
            data.companions[idx].doctors=doctors
        }
        if (alive !== null){
            data.companions[idx].alive=alive
        }
        res.status(200).send(data.companions[idx])
    })
    .delete((req, res) => {
        console.log(`DELETE /companions/${req.params.id}`);
        data.companions = data.companions.filter(comp => comp._id !== req.params.id)
        res.status(200).send({
            message: 'Deleted'
        })
    });

router.route("/companions/:id/doctors")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/doctors`);
        const d1 = data.companions.filter(comp => comp._id == req.params.id)
        if (d1.length === 0) {
            res.status(404).send({
                message:`Companion with id ${req.params.id} does not exist`
            })
        }
        else {
            var new_data = []
            d1[0].doctors.forEach(doc=>new_data.push(data.doctors.filter(dt => dt._id===doc)))
            res.status(200).send(new_data[0])
        }
    });

router.route("/companions/:id/friends")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/friends`);
        // res.status(501).send();
        const d1 = data.companions.filter(comp => comp._id == req.params.id)
        if (d1.length === 0) {
            res.status(404).send({
                message:`Companion with id ${req.params.id} does not exist`
            })
        }
        else {
            var new_arr = []
            for (var idc in data.companions) {
                if (data.companions[idc]._id !== req.params.id) {
                    for (var idx in d1[0].seasons) {
                        if (data.companions[idc].seasons.includes(d1[0].seasons[idx])) {
                            new_arr.push(data.companions[idc])
                            break
                        }
                    }
                }
            }
            res.status(200).send(new_arr)
        }
    });

//////////////////
// EXTRA CREDIT //
//////////////////
router.route("/doctors/favorites")
    .get((req, res) => {
        console.log(`GET /doctors/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /doctors/favorites`);
        res.status(501).send();
    });

router.route("/doctors/favorites/:id")
    .delete((req, res) => {
        console.log(`DELETE /doctors/favorites/:id`);
        res.status(501).send();
    });

router.route("/companions/favorites")
    .get((req, res) => {
        console.log(`GET /companions/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /companions/favorites`);
        res.status(501).send();
    })

router.route("/companions/favorites/:id")
    .delete((req, res) => {
        console.log(`DELETE /companions/favorites/:id`);
        res.status(501).send();
    });

module.exports = router;
