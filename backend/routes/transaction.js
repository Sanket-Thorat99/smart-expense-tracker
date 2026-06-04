const express = require("express");
const transactionRouter = express.Router();
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");

transactionRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, amount, type, category, isNecessary } = req.body;

    const newTransaction = new Transaction({
      userId: req.user.id,
      title,
      amount,
      type,
      category,
      isNecessary,
    });

    await newTransaction.save();

    res.json({ msg: "Transaction added", newTransaction });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

transactionRouter.get("/summary", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });

    let totalIncome = 0;
    let totalExpense = 0;
    let unnecessaryExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;

        if (!t.isNecessary) {
          unnecessaryExpense += t.amount;
        }
      }
    });

    const savingsRate =
      totalExpense > 0
        ? ((unnecessaryExpense / totalExpense) * 100).toFixed(2)
        : 0;

    let advice = "";

    if (unnecessaryExpense > 0) {
      advice = "Try reducing unnecessary expenses to save more.";
    } else {
      advice = "Great job! You are spending wisely.";
    }

    res.json({
      totalIncome,
      totalExpense,
      unnecessaryExpense,
      savingsRate: `${savingsRate}%`,
      advice,
      message: `You could have saved ₹${unnecessaryExpense}`,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
transactionRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({
      createdAt: -1,
    }); // latest first

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

transactionRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await transaction.deleteOne();

    res.json({ msg: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

transactionRouter.get("/monthly", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "expense",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = transactionRouter;
