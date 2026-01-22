import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Advocate from "../models/advocateModel.js";

// User login
export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });

        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(

            { id: user._id, role: user.role },
            process.env.SECRET

        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,        // REQUIRED for production
            sameSite: "lax",    // REQUIRED for cross-site cookies
        });

        res.status(200).json({
            message: "Login successful",
            token,
            role: user.role,
        });


    } catch (error) {
        res.status(500).json({ message: error.message });

    }
};

//LOG OUT for all roles


export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ADVOCATE sign up

export const registerAdvocate = async (req, res) => {
    try {
        const { name, email, password, licenseNumber, experience, specialization, licenseDocument } = req.body;

        // Basic validation
        if (!name || !email || !password || !licenseNumber || !experience || !specialization || !licenseDocument) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) { return res.status(400).json({ message: "User already exists" }); }

        const hashedpassword = await bcrypt.hash(password, 10)

        // Create User (NOT verified)
        const user = await User.create({
            name,
            email,
            password: hashedpassword,          // hashed by User model
            role: "advocate",  // backend enforced
            isVerified: false, // admin must approve
        });

        // Create Advocate profile (pending)
        await Advocate.create({
            userId: user._id,
            licenseNumber,
            experience,
            specialization,
            licenseDocument,
            status: "pending",
        });

        // Response
        res.status(201).json({
            message:
                "Advocate registration submitted. Await admin approval.",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Client signup

export const registerClient = async (req, res) => {

    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password) {return res.status(400).json({message: "All credentials are required"});
    }
        //Check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({message: "User already exists"});
        }
        // password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create client user
        const client = await User.create({name, email, password: hashedPassword, role: "client", isVerified: true});

         res.status(201).json({
      message: "Client registered successfully",
      userId: client._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}