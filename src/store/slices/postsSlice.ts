import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sql } from '@vercel/postgres';

// ✅ Thunks
export const fetchPosts = createAsyncThunk('posts/fetchAll', async () => {
  const res = await fetch('/api/posts');
  return res.json();
});

export const addPost = createAsyncThunk(
  'posts/add',
  async ({ title, content }: { title: string; content: string }) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    return res.json();
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchById',
  async (id: number) => {
    const res = await fetch(`/api/posts/${id}`);
    return res.json();
  }
);

export const updatePost = createAsyncThunk(
  'posts/update',
  async ({
    id,
    title,
    content,
  }: {
    id: number;
    title: string;
    content: string;
  }) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    return res.json();
  }
);

export const deletePost = createAsyncThunk(
  'posts/delete',
  async (id: number) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    return id;
  }
);

// ✅ Slice
const postsSlice = createSlice({
  name: 'posts',
  initialState: { items: [], currentPost: null, status: 'idle' } as {
    items: any[];
    currentPost: any;
    status: string;
    loading: boolean;
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.currentPost = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default postsSlice.reducer;
