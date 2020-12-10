const express = require('express');
const router = express.Router();
const app = require('../../app');

router.get('/', (req, res, next) => {
    if (req.session.username != undefined && req.session.type == "admin") {
        res.locals.title = 'Categories';
        res.locals.subtitle = 'Categories';
        res.render('admin/categories');
    } else if (req.session.username != undefined && req.session.type == "employee") {
        res.redirect('/home');
    } else {
        res.redirect('/admin');
    }
});

router.post('/add', function(req, res) {
    var category_id = app.categoriesRef.push().getKey();
    var category = req.body.category;

    app.categoriesRef.child(category_id).set({
        category_id: category_id,
        category: category
    });
    res.status(200).json({ status: "ok" });
});

router.post('/addSubCategory', function(req, res) {
    var category_id = req.body.category_id;
    var sub_category = req.body.newSubCategory;

    var sub_category_id = app.categoriesRef.child(category_id).push().getKey();
    app.categoriesRef.child(category_id).child("sub_categories").child(sub_category_id).set({
        sub_category_id: sub_category_id,
        sub_category: sub_category
    });
    res.status(200).json({ status: "ok" });
});

module.exports = router;