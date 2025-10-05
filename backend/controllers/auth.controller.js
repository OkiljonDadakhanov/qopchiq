import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateJwtTokenandSetCookie } from "../utils/generateJwtTokenandSetCookie.js";
 

export const signup = async (req, res) => {
    const {name, email, password} = req.body;
    try {
       if(!name || !email || !password) {
        throw new Error("All fields are required");
       }
       const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists) { 
        return res.status(400).json({ message: "User already exists" });
       }

       const hashedPassword = await bcrypt.hash(password, 10);
       const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();    

       const user = await User.create({name, email, password: hashedPassword, verificationToken, verificationTokenExpiresAt: Date.now() + 1000 * 60 * 60 * 24});

       await user.save();

       //jwt

       generateJwtTokenandSetCookie(res, user._id);

       res.status(201).json({ success: true, message: "User created successfully", user: {...user._doc, password: undefined} });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new Error("All fields are required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT and set cookie
        generateJwtTokenandSetCookie(res, user._id);

        res.status(200).json({ success: true, message: "Login successful", user: { ...user._doc, password: undefined } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    res.send("Logout controller");
}