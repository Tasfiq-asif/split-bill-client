import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import groupSlice from "./slices/groupSlice";
import transactionSlice from "./slices/transactionSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    groups: groupSlice,
    transactions: transactionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
