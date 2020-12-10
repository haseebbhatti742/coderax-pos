const express = require('express');
const router = express.Router();
const app = require('../../app');
const path = require('path');
const bwipjs = require('bwip-js');

router.get('/', (req, res, next) => {
    if (req.session.username != undefined && req.session.type == "admin") {
        res.redirect('/admin/home');
    } else if (req.session.username != undefined && req.session.type == "employee") {
        res.redirect('/home');
    } else if (req.session.username == undefined) {
        res.render('admin/login');
    }
});

router.post("/login", function(req, res) {
    app.adminsRef.child(req.body.username).once('value', function(snap) {
        if (snap.exists) {
            if (snap.child("password").val() == req.body.password) {
                req.session.username = snap.child("username").val();
                req.session.fullname = snap.child("fullname").val();
                req.session.email = snap.child("email").val();
                req.session.dp = snap.child("dp").val();
                req.session.type = "admin";
                res.status(200).json({ status: "yes" })
            } else {
                res.status(200).json({ status: 'no' });
            }
        } else {
            res.status(200).json({ status: 'no' });
        }

        // var persons = [];

        // snap.forEach(function(child) {
        //     var obj = {};
        //     obj['id'] = child.key;
        //     app.personRef.child(child.key).on('value', function(snap1) {
        //         obj['data'] = snap1.val();
        //     })
        //     persons.push(obj);
        // })

        // // console.log(persons)
        // res.render("index", { "persons": persons });
    });
})

module.exports = router;