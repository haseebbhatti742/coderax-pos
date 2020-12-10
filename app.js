//libraries
const express = require('express');
const app1 = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

//settings
app1.use(cookieParser('secret'));
app1.use(flash());
app1.use(bodyParser.json({ limit: '50mb' }));
app1.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app1.use(bodyParser.json());
app1.use(express.static('assets'));
// views and default location for views
app1.set('views', './views');
app1.set('view engine', 'jade'); // both keywords

//session management
app1.use(session({
    saveUninitialized: false,
    resave: true,
    secret: 'ssshhhhh',
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

app1.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

//db connection
// var conn = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'pos_coderax'
// });

var conn;
// conn.getConnection(function(err, con) {
//     if (err) {
//         console.log("DB Error!");
//     } else {
//         console.log("DB Connected!");
//     }
// })

//firebase database settings
const Firebase = require('firebase');
const admin = require("firebase-admin");
// const firebase_sdk = require('./firebase');
const serviceAccount = require("./pos-coderax-serviceKey.json");

Firebase.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pos-coderax-eeb41.firebaseio.com",
    authDomain: "pos-coderax-eeb41.firebaseapp.com"
});
const db = Firebase.database();
const adminsRef = db.ref("admins");
const emplpoyeesRef = db.ref("emplpoyees");
const productsRef = db.ref("products");
const categoriesRef = db.ref("categories");

//deifining routes
const loginRoute = require("./routes/admin/login");
const homeRoute = require("./routes/admin/home");
const productsRoute = require("./routes/admin/products");
const employeesRoute = require("./routes/admin/employees");
const categoriesRoute = require("./routes/admin/categories");
const tempOrderRoute = require("./routes/admin/temp-order");
const errorRoute = require("./routes/admin/error");

app1.use("/admin", loginRoute);
app1.use("/admin/home", homeRoute);
app1.use("/admin/products", productsRoute);
app1.use("/admin/employees", employeesRoute);
app1.use("/admin/categories", categoriesRoute);
app1.use("/admin/temp-order", tempOrderRoute);
app1.use("/admin/error", errorRoute);

app1.use("/admin/logout", function(req, res) {
    req.session.destroy(function(err) {
        res.redirect("/admin")
    })
})

module.exports.app = app1;
module.exports.conn = conn;
module.exports.adminsRef = adminsRef;
module.exports.emplpoyeesRef = emplpoyeesRef;
module.exports.productsRef = productsRef;
module.exports.categoriesRef = categoriesRef;