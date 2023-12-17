const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080
const mongodb = "mongodb+srv://aminaaslam985:amina123@cluster0.w7bvzq1.mongodb.net/mongocrud";

// schema 
const schemaData = mongoose.Schema({
    name : String,
    email : String,
    mobile : String
} , {
    timestamps : true
});

// model based on the upper schema 
const userModel = mongoose.model("user" , schemaData)




//read
// http://localhost:8080/

app.get("/" , async(req , res)=>{
    const data = await userModel.find({})
    res.json({success :true , data : data})
});



// create data || save data in mongodb
// http://localhost:8080/create
/*
{
name,
email, 
mobile
}
*/
app.post("/create" ,async (req , res)=>{
const data =  new userModel(req.body);
await data.save()
console.log(req.body);
res.json({success:true , message:'user created succesfully' , data:data})
})



// update 
// http://localhost:8080/update
/*{
    "id" : here goes the id of the object you want to update
    "name": "name to update"
    "email" : "",
    "mobile" : 
} */

// app.put(`/update` ,async (req , res)=>{
//     // console.log(req.query.id);
//     const {formData} = req.body;
//     const { id} = req.query.id;
//    const data1 =  await userModel.findOneAndUpdate({_id:id } , formData )
//    res.json({success: true , message:"data updated successfully" , data:data1})
// })


app.put("/update/:id", async (req, res) => {
    console.log(req.body ,'this is body');
    console.log(req.params.id , 'this is id');
    try {
      const userToUpdate = await userModel.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({message:"User Updated", success:true , data:userToUpdate});
    } catch (err) {
      return res.status(500).json(err);
    }
  });

//    userModel.findOne({ _id : req.query.id} );


// delete
// http://localhost:8080/delete/id

app.delete("/delete/:id" , async (req , res) => {
    console.log(req.params.id);
    const data = await userModel.deleteOne({_id:req.params.id});
    res.json({success: true , message:"user deleted successfully" , data:data})

})


// mongoo connection
mongoose.connect(mongodb ).then(()=>{
    console.log('succesfully connected to database');
    app.listen(PORT , ()=>{
        console.log("server is running");
    })
}).catch((err)=>{
    console.log("an error occured" , err);
})