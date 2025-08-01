import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ Thunks
export const fetchComments = createAsyncThunk(
  'comments/fetch',
  async (postId: number) => {
    const res = await fetch(`/api/comments?postId=${postId}`);
    return res.json();
  }
);

export const addComment = createAsyncThunk(
  'comments/add',
  async ({ postId, content }: { postId: number; content: string }) => {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content }),
    });
    return res.json();
  }
);

// ✅ Slice
const commentsSlice = createSlice({
  name: 'comments',
  initialState: { items: [], status: 'idle' } as {
    items: any[];
    status: string;
    loading: boolean;
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default commentsSlice.reducer;
