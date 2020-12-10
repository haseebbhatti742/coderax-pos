const express = require('express');
const router = express.Router();
const app = require('../../app');

router.get('/add', (req, res, next) => {
    if (req.session.username != undefined && req.session.type == "admin") {
        res.locals.title = 'Employees';
        res.locals.subtitle = 'Add Employees';
        res.render('admin/employee-add');
    } else if (req.session.username != undefined && req.session.type == "employee") {
        res.redirect('/home');
    } else {
        res.redirect('/admin');
    }
});

router.get('/view', (req, res, next) => {
    if (req.session.username != undefined && req.session.type == "admin") {
        res.locals.title = 'Employees';
        res.locals.subtitle = 'View Employees';

        var query = "SELECT  * FROM Employees";
        app.conn.query(query, function(err, result) {
            if (err) {
                errorMessage = err.message;
                res.redirect('/admin/error')
            } else {
                res.render('admin/employees-view', { length: result.length, dataset: result });
            }
        })
    } else if (req.session.username != undefined && req.session.type == "employee") {
        res.redirect('/home');
    } else {
        res.redirect('/admin');
    }
});


module.exports = router;