import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import groupSlice from "./slices/groupSlice";
import transactionSlice from "./slices/transactionSlice";
import expenseSlice from "./slices/expenseSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    groups: groupSlice,
    transactions: transactionSlice,
    expenses: expenseSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
