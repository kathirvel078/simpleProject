const express=require("express");
const cors=require("cors");  
const mongoose=require("mongoose");
const userRoutes=require("./routes/userRoutes.js");



const app=express();

app.use(cors()); //Access-Control-Allow-Origin missing.
app.use(express.json());

app.use("/api/users",userRoutes)


mongoose.connect("mongodb://127.0.0.1:27017/myapp")
  .then(() => console.log("DB is Connected"))
  .catch(err => console.log(err));


app.listen(3000, (req, res)=>{
    console.log("server is running in port 3000")
})
