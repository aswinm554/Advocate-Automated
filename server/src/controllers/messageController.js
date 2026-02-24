import Message from "../models/messageModel.js";
import Case from "../models/caseModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { caseId, receiverId, content, messageType } = req.body;

    if (!caseId || !receiverId || !content) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Optional: verify sender belongs to this case
    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    const message = await Message.create({
      caseId,
      sender: req.user._id,
      receiver: receiverId,
      content,
      messageType
    });

    res.status(201).json(message);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCaseMessages = async (req, res) => {
  try {
    const { caseId } = req.params;

    const messages = await Message.find({ caseId })
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};