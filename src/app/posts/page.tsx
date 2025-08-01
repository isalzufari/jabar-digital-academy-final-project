'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchPosts, deletePost } from '../../store/slices/postsSlice';

export default function PostsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Posts</h1>
      {status === 'idle' && <p>Loading...</p>}
      <ul>
        {items.map((post) => (
          <li key={post.id} className="border p-2 my-2">
            <h2 className="font-bold">{post.title}</h2>
            <p>{post.content}</p>
            <button
              className="text-red-500"
              onClick={() => dispatch(deletePost(post.id))}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
