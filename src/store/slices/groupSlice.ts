/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

interface UserRef {
  id: string;
  email: string;
  name: string;
}

interface Membership {
  id: string;
  userId: string;
  groupId: string;
  role: string;
  user: UserRef;
  joinedAt: string;
}

export interface CustomCategory {
  id: string;
  name: string;
  color: string | null;
  createdById: string;
}

export interface GuestMember {
  id: string;
  groupId: string;
  name: string;
  addedById: string;
  claimedByUserId: string | null;
  claimedAt: string | null;
  createdAt: string;
  claimedBy: { id: string; name: string; email: string } | null;
}

export interface Group {
  id: string;
  name: string;
  type: "trip" | "roommate" | "event" | "project";
  description?: string | null;
  isArchived?: boolean;
  currency: string;
  inviteCode: string;
  tripStart: string | null;
  tripEnd: string | null;
  createdById: string;
  createdBy: UserRef;
  memberships: Membership[];
  guestMembers: GuestMember[];
  customCategories?: CustomCategory[];
  createdAt: string;
  _count?: { expenses: number };
}

interface GroupState {
  groups: Group[];
  currentGroup: (Group & {
    expenses?: any[];
    payments?: any[];
  }) | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GroupState = {
  groups: [],
  currentGroup: null,
  isLoading: false,
  error: null,
};

export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/groups");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch groups");
    }
  }
);

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (data: { name: string; type?: string; description?: string; currency?: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/groups", data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to create group");
    }
  }
);

export const updateGroup = createAsyncThunk(
  "groups/update",
  async (
    { id, ...data }: { id: string; name?: string; type?: string; description?: string | null; currency?: string; tripStart?: string | null; tripEnd?: string | null },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.put(`/groups/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to update group");
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
      return rejectWithValue(error.response?.data?.error || "Failed to join group");
    }
  }
);

export const sendGroupInvite = createAsyncThunk(
  "groups/sendInvite",
  async ({ groupId, email }: { groupId: string; email: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/groups/${groupId}/invite`, { email });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to send invite");
    }
  }
);

export const addGuestMember = createAsyncThunk(
  "groups/addGuest",
  async ({ groupId, name }: { groupId: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/groups/${groupId}/guests`, { name });
      return response.data.data as GuestMember;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to add guest");
    }
  }
);

export const removeGuestMember = createAsyncThunk(
  "groups/removeGuest",
  async ({ groupId, guestId }: { groupId: string; guestId: string }, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/groups/${groupId}/guests/${guestId}`);
      return { guestId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to remove guest");
    }
  }
);

export const claimGuestMember = createAsyncThunk(
  "groups/claimGuest",
  async (
    { groupId, guestId, userId }: { groupId: string; guestId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.patch(`/groups/${groupId}/guests/${guestId}/claim`, { userId });
      return response.data.data as GuestMember;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to link guest");
    }
  }
);

export const addCustomCategory = createAsyncThunk(
  "groups/addCategory",
  async ({ groupId, name, color }: { groupId: string; name: string; color?: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/groups/${groupId}/categories`, { name, color });
      return response.data.data as CustomCategory;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to add category");
    }
  }
);

export const removeCustomCategory = createAsyncThunk(
  "groups/removeCategory",
  async ({ groupId, categoryId }: { groupId: string; categoryId: string }, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/groups/${groupId}/categories/${categoryId}`);
      return { categoryId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to remove category");
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
      return rejectWithValue(error.response?.data?.error || "Failed to fetch group");
    }
  }
);

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setCurrentGroup: (state, action: PayloadAction<GroupState["currentGroup"]>) => {
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
        state.groups.unshift(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(joinGroup.fulfilled, (state, action) => {
        state.groups.unshift(action.payload);
      })
      .addCase(joinGroup.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchGroupById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGroup = action.payload;
      })
      .addCase(fetchGroupById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.currentGroup = action.payload;
        const idx = state.groups.findIndex((g) => g.id === action.payload.id);
        if (idx !== -1) state.groups[idx] = action.payload;
      })
      .addCase(addGuestMember.fulfilled, (state, action) => {
        if (state.currentGroup) {
          if (!state.currentGroup.guestMembers) state.currentGroup.guestMembers = [];
          state.currentGroup.guestMembers.push(action.payload);
        }
      })
      .addCase(removeGuestMember.fulfilled, (state, action) => {
        if (state.currentGroup?.guestMembers) {
          state.currentGroup.guestMembers = state.currentGroup.guestMembers.filter(
            (g) => g.id !== action.payload.guestId
          );
        }
      })
      .addCase(claimGuestMember.fulfilled, (state, action) => {
        if (state.currentGroup?.guestMembers) {
          const idx = state.currentGroup.guestMembers.findIndex((g) => g.id === action.payload.id);
          if (idx !== -1) state.currentGroup.guestMembers[idx] = action.payload;
        }
      })
      .addCase(addCustomCategory.fulfilled, (state, action) => {
        if (state.currentGroup) {
          if (!state.currentGroup.customCategories) state.currentGroup.customCategories = [];
          state.currentGroup.customCategories.push(action.payload);
        }
      })
      .addCase(removeCustomCategory.fulfilled, (state, action) => {
        if (state.currentGroup?.customCategories) {
          state.currentGroup.customCategories = state.currentGroup.customCategories.filter(
            (c) => c.id !== action.payload.categoryId
          );
        }
      });
  },
});

export const { setCurrentGroup, clearError } = groupSlice.actions;
export default groupSlice.reducer;
