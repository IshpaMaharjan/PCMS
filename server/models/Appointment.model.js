import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
{
user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

professional:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

service:{
type:String,
required:true
},

date:{
type:Date,
required:true
},

status:{
type:String,
enum:["pending","accepted","rejected"],
default:"pending"
},

rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
},
},
{timestamps:true}
);

export default mongoose.model("Appointment",appointmentSchema);