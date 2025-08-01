import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunks
export const fetchLikes = createAsyncThunk(
  'likes/fetchLikes',
  async (postId: number) => {
    const res = await fetch(`/api/likes?postId=${postId}`);
    if (!res.ok) throw new Error('Failed to fetch likes');
    return res.json();
  }
);

export const toggleLike = createAsyncThunk(
  'likes/toggleLike',
  async (postId: number) => {
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });
    if (!res.ok) throw new Error('Failed to toggle like');
    return res.json();
  }
);

interface Like {
  id: number;
  user_id: number;
  post_id: number;
  userName: string;
}

interface LikesState {
  likes: Like[];
  loading: boolean;
  error: string | null;
}

const initialState: LikesState = {
  likes: [],
  loading: false,
  error: null,
};

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchLikes
      .addCase(fetchLikes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLikes.fulfilled, (state, action) => {
        state.loading = false;
        state.likes = action.payload;
      })
      .addCase(fetchLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error';
      })
      // toggleLike
      .addCase(toggleLike.fulfilled, (state, action) => {
        // kalau responsenya Unliked, buang dari state
        if (action.payload.message === 'Unliked') {
          state.likes = state.likes.filter(
            (like) => like.user_id !== action.meta.arg
          );
        } else {
          state.likes.push(action.payload);
        }
      });
  },
});

export default likesSlice.reducer;
