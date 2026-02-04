// Connection
export { connectDB } from '../connection';

// User Utilities
export {
  getUserByEmail,
  getUserById,
  getUserWithPassword,
  createUser,
  updateUser,
  updateUserPassword,
  updateUserTheme,
  deleteUserAccount,
  emailExists,
} from './user.utils';

// Category Utilities
export {
  getCategoriesByUser,
  getCategoryById,
  getSubCategoriesByCategory,
  getAllSubCategoriesByUser,
  getCategoryWithSubCategories,
  getAllCategoriesWithSubCategories,
} from './category.utils';

export {
  getCategoryStatistics,
  getSubCategoryStatistics
} from './category-stats.utils'

// Expense Utilities
export {
  getRecentExpenses,
  getExpensesByMonth,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesByCategory,
  getTotalExpensesForCategory,
} from './expense.utils';

// Budget Utilities
export {
  getBudgetsByMonth,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
  budgetExists,
  getTotalBudgetForMonth,
} from './budget.utils';

// Income Source Utilities
export {
    getIncomeSourcesByUser,
    getIncomeSourceById,
    createIncomeSource,
    updateIncomeSource,
    deleteIncomeSource,
} from './incomeSource.utils';

// Income Utilities
export {
    getRecentIncomes,
    getIncomesByMonth,
    getIncomeById,
    createIncome,
    updateIncome,
    deleteIncome,
    getTotalIncomeForMonth,
    getIncomesBySource,
    getTotalIncomeForSource,
} from './income.utils';

// Seed Categories and Income Sources for user
export {
    seedCategoriesForUser,
    seedIncomeSourcesForUser,
    userHasCategories,
    userHasIncomeSources,
    seedAllForUser,
} from './seed';

// Dashboard utilities
export {
  getDashboardSummary,
  userHasExpenses,
  userHasBudgets,
} from './dashboard.utils';