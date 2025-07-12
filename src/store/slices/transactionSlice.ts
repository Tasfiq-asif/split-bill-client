import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

interface TransactionShare {
  userId: {
    _id: string;
    displayName: string;
    email: string;
  };
  share: number;
}

interface Transaction {
  _id: string;
  groupId: string;
  paidBy: {
    _id: string;
    displayName: string;
    email: string;
  };
  amount: number;
  description: string;
  category: "food" | "transport" | "accommodation" | "activities" | "other";
  splitBetween: TransactionShare[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface Settlement {
  _id: string;
  groupId: string;
  from: {
    _id: string;
    displayName: string;
    email: string;
  };
  to: {
    _id: string;
    displayName: string;
    email: string;
  };
  amount: number;
  status: "pending" | "completed";
  createdAt: string;
  updatedAt: string;
}

interface TransactionState {
  transactions: Transaction[];
  settlements: Settlement[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  settlements: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/groups/${groupId}/transactions`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch transactions"
      );
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (
    transactionData: Omit<Transaction, "_id" | "createdAt" | "updatedAt">,
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/transactions", transactionData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create transaction"
      );
    }
  }
);

export const fetchSettlements = createAsyncThunk(
  "transactions/fetchSettlements",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/groups/${groupId}/settlements`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch settlements"
      );
    }
  }
);

export const markSettlementCompleted = createAsyncThunk(
  "transactions/markSettlementCompleted",
  async (settlementId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/settlements/${settlementId}`, {
        status: "completed",
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to mark settlement as completed"
      );
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearTransactions: (state) => {
      state.transactions = [];
    },
    clearSettlements: (state) => {
      state.settlements = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchSettlements.fulfilled, (state, action) => {
        state.settlements = action.payload;
      })
      .addCase(fetchSettlements.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(markSettlementCompleted.fulfilled, (state, action) => {
        const index = state.settlements.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) {
          state.settlements[index] = action.payload;
        }
      });
  },
});

export const { clearTransactions, clearSettlements, clearError } =
  transactionSlice.actions;
export default transactionSlice.reducer;
