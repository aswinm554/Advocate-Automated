import Document from "../../models/documentModel.js";
import Case from "../../models/caseModel.js";
import cloudinary from "../../config/cloudinary.js";

import fs from "fs";


export const uploadDocument = async (req, res) => {
  try {
    const { caseId, title, category, isPrivate } = req.body;

    if (!caseId || !title || !req.file) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const caseExists = await Case.findOne({
      _id: caseId,
      advocateId: req.user.id,
    });

    if (!caseExists) {
      return res.status(404).json({ message: "Case not found" });
    }

    const document = await Document.create({
      advocateId: req.user.id,
      caseId,
      uploadedBy: req.user.id,
      title,
      fileUrl: req.file.path,      
      publicId: req.file.filename, 
      category,
      isPrivate,
    });

    res.status(201).json(document);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload document" });
  }
};

export const getCaseDocuments = async (req, res) => {
    try {
        const caseData = await Case.findOne({
            _id: req.params.caseId,
            advocateId: req.user.id,
        });

        if (!caseData) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const documents = await Document.find({
            caseId: req.params.caseId,
            isDeleted: false,
        })
            .select("-__v")
            .sort({ createdAt: -1 });

        res.status(200).json(documents);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      advocateId: req.user.id,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    await cloudinary.uploader.destroy(document.publicId);

    await document.deleteOne();

    res.status(200).json({ message: "Document deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
