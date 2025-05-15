import { User } from "../models/users.js"
import bcryptjs from 'bcryptjs'
import { getTokenAndSetCookie } from "../utils/getTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../utils/mails.js";
import crypto from 'crypto'

export const signup = async(req,res)=>{
    const {email,password,name}=req.body;
console.log("Signup request received with:", { email, password, name }); 
    try {
        if(!email||!password||!name){
            throw new Error("user must provide email password and name")
        }
        
        const userAlreadyExists=await User.findOne({email}).select('-password')

        if(userAlreadyExists){
            return res.status(400).json({success:false,message:"user already exists"})
        }

        const hashedPassword=await bcryptjs.hash(password,10);
        const token =  crypto.randomInt(100000, 1000000).toString();
        const user=new User({
            email,
            password:hashedPassword,
            name,
            token,
            tokenExpiresAt:Date.now()+24*60*60*1000
        })

        await user.save();   

        getTokenAndSetCookie(res,user._id)

        await sendVerificationEmail(user.email,token)

        res.status(201).json({success:true,message:"user created successfully",user})
    } catch (error) {
        res.status(400).json({success:false,message:error.message})
    }
}

export const verify = async(req,res)=>{
    const {token} = req.body;

    try {
        const user = await User.findOne({token,tokenExpiresAt:{$gt:Date.now()}}).select('-password')

        if(!user){
            return res.status(400).json({success:false,message:"invalid or expired verification token"})
        }

        user.isVerified=true
        user.token=undefined
        user.tokenExpiresAt=undefined;
        await user.save();

        await sendWelcomeEmail(user.email,user.name)

        return res.status(201).json({success:true,message:"email verified successfully",user});
    } catch (error) {
        res.status(500).json({success:false,message:"something wrong..."})
    } 
}

export const login = async(req,res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('-password');

        if (!user) {
            return res.status(400).json({ success: false, message: "user not found" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: "verify your email first" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "invalid credentials" });
        }

        getTokenAndSetCookie(res, user._id);

        return res.status(200).json({ success: true, message: "login successful", user });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "something went wrong" });
    }
}

export const checkAuth=async(req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(400).json({success:false,message:"User not found"})
        }
        
        res.status(200).json({success:true,user})
    } catch (error) {
        console.log("Error in checkAuth ", error)
        res.status(400).json({success:false,message:error.message});
    }
}


export const logout=async(req,res)=>{
    res.clearCookie("token")
    res.status(200).json({success:true,message:"Logged out successfully!"})
}