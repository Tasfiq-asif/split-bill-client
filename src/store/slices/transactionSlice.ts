/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

interface UserRef {
  id: string;
  name: string;
}

export interface Settlement {
  from: UserRef;
  to: UserRef;
  amount: string;
}

export interface Payment {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: string;
  currency: string;
  method: string;
  note: string | null;
  recordedAt: string;
  fromUser: { id: string; email: string; name: string };
  toUser: { id: string; email: string; name: string };
}

export interface BalanceEntry {
  memberId: string;
  memberName: string;
  totalPaid: string;
  totalOwed: string;
  paymentsOut: string;
  paymentsIn: string;
  net: string;
  isGuest?: boolean;
}

interface TransactionState {
  settlements: Settlement[];
  payments: Payment[];
  balances: Record<string, BalanceEntry[]>;
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  settlements: [],
  payments: [],
  balances: {} as Record<string, BalanceEntry[]>,
  isLoading: false,
  error: null,
};

export const fetchBalances = createAsyncThunk(
  "transactions/fetchBalances",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/groups/${groupId}/balances`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch balances");
    }
  }
);

export const fetchSimplifiedDebts = createAsyncThunk(
  "transactions/fetchSimplifiedDebts",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/groups/${groupId}/simplify`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to simplify debts");
    }
  }
);

export const recordPayment = createAsyncThunk(
  "transactions/recordPayment",
  async (
    data: { groupId: string; toUserId: string; amount: number; currency?: string; method?: string; note?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post(`/groups/${data.groupId}/payments`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to record payment");
    }
  }
);

export const fetchPayments = createAsyncThunk(
  "transactions/fetchPayments",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/groups/${groupId}/payments`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch payments");
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearTransactions: (state) => {
      state.settlements = [];
      state.payments = [];
      state.balances = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalances.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBalances.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balances[action.meta.arg] = action.payload;
      })
      .addCase(fetchBalances.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSimplifiedDebts.fulfilled, (state, action) => {
        state.settlements = action.payload;
      })
      .addCase(fetchSimplifiedDebts.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(recordPayment.fulfilled, (state, action) => {
        state.payments.unshift(action.payload);
      })
      .addCase(recordPayment.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.payments = action.payload;
      });
  },
});

export const { clearTransactions, clearError } = transactionSlice.actions;
export default transactionSlice.reducer;
