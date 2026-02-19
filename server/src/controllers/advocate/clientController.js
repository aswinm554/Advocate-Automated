import Client from "../../models/clientModel.js";
import Case from "../../models/caseModel.js";
import Payment from "../../models/paymentModel.js";

export const getAdvocateClients = async (req, res) => {
  try {
    if (req.user.role !== "advocate") {
      return res.status(403).json({ message: "Advocate only" });
    }
    const { search } = req.query;
    const query = { advocateId: req.user.id };
    const clients = await Client.find(query).populate("userId", "name email phone").sort({ createdAt: -1 });
    res.status(200).json(clients)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch clients",
      error: error.message
    });
  }
};

export const getClientById = async (req, res) => {
  try {
    if (req.user.role !== "advocate") {
      return res.status(403).json({ message: "Advocate only" });
    }

    const client = await Client.findOne({
      _id: req.params.id,
      advocateId: req.user.id
    }).populate("userId", "name email phone");

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const cases = await Case.find({
      advocateId: req.user.id,
      clientId: client.userId

    });

    res.status(200).json({
      client,
      cases
    });

    const payments = await Payment.find({
      advocateId: req.user.id,
      clientId: client._id
    });

    res.status(200).json({
      client,
      cases,
      payments
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch client",
      error: error.message
    });
  }
};


export const updateClientNotes = async (req, res) => {
  try {
    if (req.user.role !== "advocate") {
      return res.status(403).json({ message: "Advocate only" });
    }

    const { notes } = req.body;

    const client = await Client.findOneAndUpdate(
      {
        _id: req.params.id,
        advocateId: req.user.id
      },
      { notes },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);

  } catch (error) {
    res.status(500).json({
      message: "Failed to update notes",
      error: error.message
    });
  }
};
