const express = require('express');
const router = express.Router();
const app = require('../../app');

router.get('/add', (req, res, next) => {
    if (req.session.username != undefined && req.session.type == "admin") {
        res.locals.title = 'Products';
        res.locals.subtitle = 'Add Products';
        res.render('admin/product-add');
    } else if (req.session.username != undefined && req.session.type == "employee") {
        res.redirect('/home');
    } else {
        res.redirect('/admin');
    }
});

router.get('/view', (req, res, next) => {
    if (req.session.username != undefined && req.session.type == "admin") {
        res.locals.title = 'Products';
        res.locals.subtitle = 'View Products';

        var query = "SELECT * from product ORDER BY product_id DESC";
        app.conn.query(query, function(err, result) {
            if (err) {
                console.log(err.message);
                res.locals.error = err.message;
                res.redirect('/admin/error');
            } else if (result.length == 0) {
                res.render('admin/products-view', { length: result.length, dataset: result });
            } else if (result.length > 0) {
                res.render('admin/products-view', { length: result.length, dataset: result });
            }
        });
    } else if (req.session.username != undefined && req.session.type == "employee") {
        res.redirect('/home');
    } else {
        res.redirect('/admin');
    }
});

router.post('/getCategory', async function(req, res) {
    var categories = await getCategory();
    res.status(200).json({ status: "yes", category: categories });
})

function getCategory() {
    var categories = [];
    return new Promise(function(resolve, reject) {
        app.categoriesRef.once('value', function(snap) {
            snap.forEach(function(child) {
                var obj = {};
                obj['category_id'] = child.key;
                obj['category'] = child.child("category").val();
                categories.push(obj);
            })
            resolve(categories);
        })
    })
}

router.post('/getSubCategory', async function(req, res) {
    var sub_category = await getSubCategory(req.body.category_id);
    res.status(200).json({ status: "yes", sub_category: sub_category });
})

function getSubCategory(category_id) {
    var sub_categories = [];
    return new Promise(function(resolve, reject) {
        app.categoriesRef.child(category_id).child("sub_categories").once('value', function(snap) {
            snap.forEach(function(child) {
                var obj = {};
                obj['sub_category_id'] = child.key;
                obj['sub_category'] = child.child("sub_category").val();
                sub_categories.push(obj);
            })
            resolve(sub_categories);
        })
    })
}

router.post('/product-add', function(req, res) {
    let p_id;
    app.productsRef.once("value", function(snap) {
        if (snap.hasChildren()) {
            res.status(200).json({ status: "error", errorMessage: "" });
        } else {
            res.status(200).json({ status: "error", errorMessage: "No Products" });
        }
    })

    // var query = "INSERT INTO product (product_name, product_selling_price, product_actual_price, product_quantity, product_size, product_category ,product_sub_category, product_desc, product_status) VALUES ('" + req.body.product_name + "','" + req.body.product_selling_price + "','" + req.body.product_actual_price + "','" + req.body.product_quantity + "','" + req.body.product_size + "','" + req.body.product_category + "','" + req.body.product_sub_category + "','" + req.body.product_desc + "','available')";
    // app.conn.query(query, function(err, result) {
    //     if (err) {
    //         res.status(200).json({ status: "error", errorMessage: err.message });
    //     } else {
    //         res.status(200).json({ status: "ok" });
    //     }
    // })
})

router.post('/get', (req, res, next) => {
    var query = "SELECT * from product WHERE product_id = " + req.body.product_id;
    app.conn.query(query, function(err, result) {
        if (err) {
            res.status(200).json({ status: "error", errorMessage: err.message });
        } else if (result.length == 0) {
            res.status(200).json({ status: "no" });
        } else if (result.length > 0) {
            res.status(200).json({ status: "yes", length: result.length, dataset: result });
        }
    });

});

module.exports = router;