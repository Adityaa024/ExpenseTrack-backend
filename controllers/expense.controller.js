import { Expense } from "../models/expense.model.js";

// ======================= ADD EXPENSE ======================= //
export const addExpense = async (req, res) => {
  try {
        console.log("🔥 addExpense route hit");
console.log("📦 Request body:", req.body);
console.log("👤 User ID from req.id:", req.id);
    const { description, amount, category } = req.body;



    // Validate required fields
    if (!description || !amount || !category) {
      return res.status(400).json({
        message: "Description, amount, and category are required",
        success: false,
      });
    }

    // Create new expense linked to the logged-in user
    const expense = await Expense.create({
      description,
      amount,
      category,
      userId: req.id, // ✅ FIX: use `req.id`, not `req.user.id`
    });

    return res.status(201).json({
      message: "Expense added successfully",
      expense,
      success: true,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ======================= GET ALL EXPENSES ======================= //
export const getAllExpense = async (req, res) => {
  try {
    const userId = req.id;
    const category = req.query.category || "";
    const done = req.query.done || ""; // ✅ FIXED: was mistakenly using category here

    const query = { userId };

    // Filter by category
    if (category.toLowerCase() !== "all" && category !== "") {
      query.category = { $regex: category, $options: "i" }; // case-insensitive
    }

    // Filter by done status (optional)
    if (done.toLowerCase() === "true") {
      query.done = true;
    } else if (done.toLowerCase() === "false") {
      query.done = false;
    }

    const expenses = await Expense.find(query).sort({ createdAt: -1 });

    if (!expenses.length) {
      return res.status(404).json({
        message: "No expenses found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Expenses fetched successfully",
      expenses,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ======================= MARK AS DONE / UNDONE ======================= //
export const markAsDoneOrUndone = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const { done } = req.body; // ✅ FIX: extract `done` from req.body

    if (typeof done !== "boolean") {
      return res.status(400).json({
        message: "`done` must be a boolean (true/false)",
        success: false,
      });
    }

    const expense = await Expense.findByIdAndUpdate(
      expenseId,
      { done },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Expense updated successfully",
      expense,
      success: true,
    });
  } catch (error) {
    console.error("Error updating done status:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ======================= DELETE EXPENSE ======================= //
export const removeExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    const expense = await Expense.findByIdAndDelete(expenseId);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Expense deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ======================= UPDATE EXPENSE ======================= //
export const updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const { description, amount, category } = req.body;

    const updateData = { description, amount, category };

    const expense = await Expense.findByIdAndUpdate(expenseId, updateData, {
      new: true,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Expense updated successfully",
      expense,
      success: true,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
