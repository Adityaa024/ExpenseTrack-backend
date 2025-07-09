import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    description:{
         type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    category:{
         type:String,
        required:true
    },
    done:{
        type:Boolean,
        default:false
    },
    userId:{             //user id is needed for authentication
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',         //from user.model.js =User
        required:true
    }

},{
    timestamps:true
});

export const Expense = mongoose.model('Expense', expenseSchema);