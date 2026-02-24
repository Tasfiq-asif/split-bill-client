/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

interface UserRef {
  id: string;
  email: string;
  name: string;
}

interface Split {
  id: string;
  memberId: string | null;
  guestMemberId: string | null;
  amount: string;
  shareType: string;
  member: UserRef | null;
  guestMember: { id: string; name: string } | null;
}

export interface Expense {
  id: string;
  groupId: string;
  payerId: string;
  guestPayerId: string | null;
  amount: string;
  currency: string;
  category: string;
  description: string | null;
  date: string;
  splitType: string;
  payer: UserRef;
  guestPayer: { id: string; name: string } | null;
  splits: Split[];
  createdAt: string;
}

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
  isLoading: false,
  error: null,
};

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/expenses/group/${groupId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch expenses");
    }
  }
);

export const createExpense = createAsyncThunk(
  "expenses/createExpense",
  async (
    data: {
      groupId: string;
      amount: number;
      currency?: string;
      category?: string;
      description?: string;
      splitType: string;
      splits: { memberId?: string; guestMemberId?: string; value?: number }[];
      payerId?: string;
      guestPayerId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/expenses", data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to create expense");
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (expenseId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/expenses/${expenseId}`);
      return expenseId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete expense");
    }
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    clearExpenses: (state) => {
      state.expenses = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter((e) => e.id !== action.payload);
      });
  },
});

export const { clearExpenses, clearError } = expenseSlice.actions;
export default expenseSlice.reducer;
