import { CategoryType, ExpenseCategoriesType } from "@/types";
import { colors } from "./theme";
import * as Icons from "phosphor-react-native";

// Add fallback category
export const fallbackCategory: CategoryType = {
  label: "Other",
  value: "others",
  icon: Icons.Question,
  bgColor: colors.neutral400,
};

export const expenseCategories: ExpenseCategoriesType = {
  groceries: {
    label: "Groceries",
    value: "groceries",
    icon: Icons.ShoppingCart,
    bgColor: "#1F2937", // Dark gray-blue
  },
  rent: {
    label: "Rent",
    value: "rent",
    icon: Icons.House,
    bgColor: "#075985", // Dark blue
  },
  utilities: {
    label: "Utilities",
    value: "utilities",
    icon: Icons.Lightbulb,
    bgColor: "#CA8A04", // Golden brown
  },
  transportation: {
    label: "Transportation",
    value: "transportation",
    icon: Icons.Car,
    bgColor: "#B45309", // Rust orange
  },
  entertainment: {
    label: "Entertainment",
    value: "entertainment",
    icon: Icons.FilmStrip,
    bgColor: "#6D28D9", // Purple
  },
  dining: {
    label: "Dining",
    value: "dining",
    icon: Icons.ForkKnife,
    bgColor: "#BE185D", // Pink-red
  },
  health: {
    label: "Health",
    value: "health",
    icon: Icons.Heart,
    bgColor: "#DC2626", // Red
  },
  insurance: {
    label: "Insurance",
    value: "insurance",
    icon: Icons.ShieldCheck,
    bgColor: "#404040", // Dark gray
  },
  savings: {
    label: "Savings",
    value: "savings",
    icon: Icons.PiggyBank,
    bgColor: "#065F46", // Forest green
  },
  clothing: {
    label: "Clothing",
    value: "clothing",
    icon: Icons.TShirt,  // Corrected icon
    bgColor: "#7C3AED",  // Unique purple
  },
  personal: {
    label: "Personal",
    value: "personal",
    icon: Icons.User,  // Corrected icon
    bgColor: "#059669",  // Emerald green
  },
  others: {
    label: "others",
    value: "others",
    icon: Icons.DotsThreeOutline,  // Corrected icon
    bgColor: "#525252",
  }
};

export const incomeCategory: CategoryType = {
  label: "Income",
  value: "income",
  icon: Icons.CurrencyDollarSimple,
  bgColor: "#16A34A" // Vibrant green
};

export const transactionTypes = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
];