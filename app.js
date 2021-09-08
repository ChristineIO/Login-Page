require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/loginDB", { useNewUrlParser: true, useUnifiedTopology: true });

const loginSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Login = new mongoose.model("Login", loginSchema);

app.get('/', function (req, res) {
    res.render("home");
});

app.get('/login', function (req, res) {
    res.render("login");
});

app.post('/login', function (req, res) {
    const email = req.body.mail;
    const password = req.body.password;

    Login.findOne({ email: email }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    if (result == true) {
                        res.render('finish');
                    }
                });
            }
        }
    });
});

app.get('/register', function (req, res) {
    res.render("register");
});

app.post('/register', function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new Login({
            name: req.body.name,
            email: req.body.mail,
            password: hash
        });
        newUser.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.render('finish')
            }
        });
    });
});

app.listen(3030, function () {
    console.log("Server running on http://localhost:3030");
});
