const express = require('express'),
app = express(),
flash = require('express-flash'),
session = require('express-session'),
cookieParser = require('cookie-parser'),
validator = require('validator');


// configure ejs as view engine
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

// parse application/json
app.use(express.json());

// configure cookie parser
app.use(cookieParser("b7b9686321a86f5508bf47634b72e216"));

// use express-session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

// use express-flash
app.use(flash());

app.get("/", (req, res) => {
  let emailErr = req.flash("emailErr");
  let nameErr = req.flash("nameErr");
  let pointsErr = req.flash("pointsErr");
  let email = req.flash("email");
  let name = req.flash("name");
  let points = req.flash("points");

  emailErr = (emailErr == undefined || emailErr.length == 0) ? undefined : emailErr;
  nameErr = (nameErr == undefined || nameErr.length == 0) ? undefined : nameErr;
  pointsErr = (pointsErr == undefined || pointsErr.length == 0) ? undefined : pointsErr;

  email = (email == undefined || email.length == 0) ? "" : email;
  points = (points == undefined || points.length == 0) ? "" : points;
  name = (name == undefined || name.length == 0) ? "" : name;

  res.render("index", {
    emailErr, nameErr, pointsErr, email, name, points
  });
});

app.post("/form", (req, res) => {
  const { email, name, points } = req.body;

  let emailErr;
  let nameErr;
  let pointsErr;

  if( validator.isEmail(email) == true){
    emailErr = "There is an email (: by Validator.";

  }

  if(points == undefined || points > 10){
    pointsErr = "The maximum number of points is 10."
  }

  if(name == undefined || name == ""){
    nameErr = "Name cannot be empty.";
  }

  if(emailErr != undefined || pointsErr != undefined  || nameErr != undefined){
    req.flash("emailErr", emailErr);
    req.flash("pointsErr", pointsErr);
    req.flash("nameErr", nameErr);

    req.flash("email", email);
    req.flash("name", name);
    req.flash("points", points);

    res.redirect("/");
  }else{
    res.send("It's ok!");
  }
});

app.listen(5001, (req, res) => {
  console.log("Server is running!");
});