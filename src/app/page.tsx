'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchPosts, deletePost } from '../store/slices/postsSlice';
import Link from 'next/link';

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Posts</h1>
      {status === 'idle' && <p>Loading...</p>}
      <ul>
        {items.map((post) => (
          <li key={post.id} className="border p-4 my-2 rounded">
            <h2 className="font-bold text-lg">{post.title}</h2>
            <p className="text-gray-700">{post.content}</p>
            <div className="flex gap-4 mt-2">
              <Link
                href={`/posts/${post.id}`}
                className="text-blue-600 hover:underline"
              >
                View Detail
              </Link>
              <button
                className="text-red-500 hover:underline"
                onClick={() => dispatch(deletePost(post.id))}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
