const express=require("express");
const cors=require("cors");  
const mongoose=require("mongoose");
const userRoutes=require("./routes/userRoutes.js");



const app=express();

app.use(cors()); //Access-Control-Allow-Origin missing.
app.use(express.json());

app.use("/api/users",userRoutes)


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB is Connected"))
  .catch(err => console.log(err));

  const PORT=process.env.PORT ||3000

app.listen(PORT, (req, res)=>{
    console.log("server is running in port 3000")
})
