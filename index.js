const express=require("express")
const app=express()
const port=3000
const path=require("path")

const mongoose = require('mongoose');
const refer= require('./models/referral.js')

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Health_Link');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main().then((res)=>{
    console.log("Connected to MongoDB");
}).catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
    console.log("running");
});

app.get("/form", (req, res) => {
    res.render("form.ejs");
});

//Refer history
app.get("/referralhistory", async(req, res) => {
    let refers= await refer.find()
    res.render('history.ejs',{refers});
});
app.post("/referralform", async (req, res) => {
  try {
    const {
      patientname,
      contactnumber,
      condition,
      hospital,
      age,
      gender,
      blood_group,
      recenttests,
      precautionsforthepatient,
      policynumber,
      idproof,
      insurancepolicy,
    } = req.body;

    console.log("Form data received:", req.body); // Debug log to verify form data

    const newRefer = new refer({
      patientname,
      contactnumber,
      condition,
      hospital,
      age,
      gender,
      blood_group,
      recenttests,
      precautionsforthepatient,
      policynumber,
      idproof,
      insurancepolicy,
    });

    await newRefer.save();
    console.log("Referral saved successfully");
    res.redirect("/referralhistory");
  } catch (err) {
    console.error("Kindly fill all the details and check if it is valid referral not worked", err);
    res.status(500).send("Kindly fill all the details and check if it is valid referral not worked");
  }
});

app.get("/referredform/:id",async (req,res)=>{
    let {id}=req.params
    let refers= await refer.findById(id)
    res.render("referredform.ejs",{refers});
})
