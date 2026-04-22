const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth.js");

const SECRET_KEY = "mysecretkey"; //.env

//get
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.find().select("-password"); //fetch all user,hide password
    res.json({ data: user }); //send user to frontend    
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

//post

router.post("/register", async (req, res) => {
  try {
    const { name, age, email, password } = req.body; //get data from frontEnd
    if (!name || !email) {
      return res.status(400).json({ msg: "Name and Email Required" });
    }
    // check duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ msg: "Email already exists" }); //conflict
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, age, email, password: hashedPassword });

    const savedUser = await user.save(); //save to mongoDB

    res.status(201).json({ msg: "User Created Sucessfully", data: savedUser });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    // create token     3parts Header,Payload,signature
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

//put

router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id, //url to get id
      req.body,
      { new: true }, //return new update
    );
    if (!updated) {
      res.status(404).json({ msg: "User Not Found" });
    }
    res.status(200).json({ data: updated });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

//delete
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    res.status(200).json({ msg: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
