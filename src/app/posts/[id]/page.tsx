'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { fetchPostById } from '../../../store/slices/postsSlice';
import { fetchComments, addComment } from '../../../store/slices/commentsSlice';
import { fetchLikes, toggleLike } from '../../../store/slices/likesSlice';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id, 10);

  const dispatch = useDispatch<AppDispatch>();
  const { currentPost, loading: postLoading } = useSelector(
    (state: RootState) => state.posts
  );
  const { items: comments, loading: commentsLoading } = useSelector(
    (state: RootState) => state.comments
  );
  const { likes, loading: likesLoading } = useSelector(
    (state: RootState) => state.likes
  );

  const [newComment, setNewComment] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    dispatch(fetchPostById(postId));
    dispatch(fetchComments(postId));
    dispatch(fetchLikes(postId));
  }, [dispatch, postId]);

  const handleAddComment = () => {
    if (!session) {
      alert('You must be logged in to comment');
      return;
    }
    if (newComment.trim() === '') return;
    dispatch(addComment({ postId, content: newComment }));
    setNewComment('');
  };

  const handleLike = () => {
    if (!session) {
      alert('You must be logged in to like');
      return;
    }
    dispatch(toggleLike(postId));
  };

  if (postLoading) return <p className="p-6">Loading post...</p>;
  if (!currentPost) return <p className="p-6">Post not found</p>;

  const isLiked = likes.some((like: any) => like.user_id === session?.user?.id);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{currentPost.title}</h1>
      <p className="mb-2 text-gray-700">{currentPost.content}</p>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleLike}
          className={`px-3 py-1 rounded ${
            isLiked ? 'bg-red-500 text-white' : 'bg-gray-200'
          }`}
        >
          {isLiked ? 'Unlike' : 'Like'}
        </button>
        <span>{likes.length} Likes</span>
      </div>

      <h2 className="text-2xl font-semibold mb-2">Comments</h2>
      {commentsLoading ? (
        <p>Loading comments...</p>
      ) : (
        <ul className="mb-4">
          {comments.map((c: any) => (
            <li key={c.id} className="border-b py-2">
              <p>{c.content}</p>
              <span className="text-sm text-gray-500">
                by {c.commenter ?? 'Anon'}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={session ? 'Add a comment' : 'Login to add a comment'}
          className="flex-1 border px-3 py-2 rounded"
          disabled={!session}
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!session}
        >
          Send
        </button>
      </div>
    </main>
  );
}
