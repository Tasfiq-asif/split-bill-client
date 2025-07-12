import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

interface Member {
  userId: {
    _id: string;
    displayName: string;
    email: string;
  };
  joinedAt: string;
  status: "active" | "inactive";
}

interface Group {
  _id: string;
  name: string;
  description: string;
  adminId: {
    _id: string;
    displayName: string;
    email: string;
  };
  members: Member[];
  inviteCode: string;
  status: "active" | "completed";
  createdAt: string;
  updatedAt: string;
}

interface GroupState {
  groups: Group[];
  currentGroup: Group | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GroupState = {
  groups: [],
  currentGroup: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/groups");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch groups"
      );
    }
  }
);

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (
    { name, description }: { name: string; description?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/groups", { name, description });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create group"
      );
    }
  }
);

export const joinGroup = createAsyncThunk(
  "groups/joinGroup",
  async ({ inviteCode }: { inviteCode: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/groups/join", { inviteCode });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to join group"
      );
    }
  }
);

export const fetchGroupById = createAsyncThunk(
  "groups/fetchGroupById",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/groups/${groupId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch group"
      );
    }
  }
);

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setCurrentGroup: (state, action: PayloadAction<Group | null>) => {
      state.currentGroup = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(joinGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })
      .addCase(joinGroup.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        state.currentGroup = action.payload;
      })
      .addCase(fetchGroupById.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentGroup, clearError } = groupSlice.actions;
export default groupSlice.reducer;
