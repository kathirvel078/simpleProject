require('dotenv').config();
const express=require("express");
const cors=require("cors");  
const mongoose=require("mongoose");
const userRoutes=require("./routes/userRoutes.js");



const app=express();

app.use(cors({
  origin: (origin, callback) => {
  if (!origin || origin.includes("vercel.app") || origin.includes("localhost")) {
    callback(null, true);
  } else {
    callback(new Error("CORS blocked"));
  }
}
})); 
app.use(express.json());

app.use("/api/users", userRoutes);  
const path = require("path");


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB is Connected"))
  .catch(err => console.log(err));

  const PORT=process.env.PORT ||3000

  app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(PORT, (req, res)=>{
    console.log("server is running in port 3000")
})
