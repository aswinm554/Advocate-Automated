import User from "../../models/userModel.js";
import Case from "../../models/caseModel.js";
import bcrypt from "bcryptjs";


export const addJuniorAdvocate = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "advocate") {
            return res.status(403).json({ message: "Advocate only" });
        }

        const { name, email, password, phone, address } = req.body;

        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const junior = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role: "junior_advocate",
            parentAdvocateId: req.user.id,
            isVerified: true
        });

        res.status(201).json({
            message: "Junior advocate added successfully",
            id : junior._id
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add junior",
            error: error.message
        });
    }
};


export const getJuniorAdvocates = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "advocate") {
            return res.status(403).json({ message: "Advocate only" });
        }

        const juniors = await User.find({
            role: "junior_advocate",
            parentAdvocateId: req.user.id
        }).select("name email phone status createdAt");

        res.status(200).json(juniors);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch juniors",
            error: error.message
        });
    }
};

export const getJuniorCases = async (req, res) => {
   try {
    if (req.user.role !== "advocate") {
      return res.status(403).json({ message: "Advocate only" });
    }

    const { id } = req.params;

    const junior = await User.findById(id);  
   

    if (!junior || junior.role !== "junior_advocate") {
      return res.status(400).json({ message: "Invalid junior" });
    }

    if (junior.parentAdvocateId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your junior" });
    }

    const cases = await Case.find({
      assignedJuniors: id
    })
      .populate("clientId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(cases);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cases",
      error: error.message
    });
  }
};

export const assignCaseToJunior = async (req, res) => {
  try {
    if (req.user.role !== "advocate") {
      return res.status(403).json({ message: "Advocate only" });
    }

    const { id, caseId } = req.body;

    const caseData = await Case.findOne({
      _id: caseId,
      advocateId: req.user.id
    });

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    const junior = await User.findById(id);

    if (!junior || junior.role !== "junior_advocate") {
      return res.status(400).json({ message: "Invalid junior" });
    }

    if (junior.parentAdvocateId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your junior" });
    }

    if (
      caseData.assignedJuniors.some(
        id => id.toString() === id
      )
    ) {
      return res.status(400).json({ message: "Junior already assigned" });
    }

    caseData.assignedJuniors.push(id);
    await caseData.save();

    res.status(200).json({ message: "Case assigned successfully" });

  } catch (error) {
    res.status(500).json({
      message: "Failed to assign case",
      error: error.message
    });
  }
};