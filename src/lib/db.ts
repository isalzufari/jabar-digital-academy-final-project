// src/lib/db.ts
import { sql } from '@vercel/postgres';

/* ================= USERS ================= */
export const getUsers = async () => {
  const { rows } = await sql`SELECT * FROM users ORDER BY id;`;
  return rows;
};

export const getUserById = async (id: number) => {
  const { rows } = await sql`SELECT * FROM users WHERE id = ${id};`;
  return rows[0];
};

export const createUser = async (
  name: string,
  email: string,
  hashedPassword: string,
  role = 'reader'
) => {
  const { rows } = await sql`
    INSERT INTO users (name, email, password, role)
    VALUES (${name}, ${email}, ${hashedPassword}, ${role})
    RETURNING id;
  `;
  return rows[0];
};

export const deleteUser = async (id: number) => {
  await sql`DELETE FROM users WHERE id = ${id};`;
};

/* ================= CATEGORIES ================= */
export const getCategories = async () => {
  const { rows } = await sql`SELECT * FROM categories ORDER BY id;`;
  return rows;
};

export const createCategory = async (name: string, description: string) => {
  const { rows } = await sql`
    INSERT INTO categories (name, description)
    VALUES (${name}, ${description})
    RETURNING *;
  `;
  return rows[0];
};

/* ================= POSTS ================= */
export const getPosts = async () => {
  const { rows } = await sql`
    SELECT p.id, p.title, u.name AS author, c.name AS category, p.created_at
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC;
  `;
  return rows;
};

export const getPostById = async (id: number) => {
  const { rows } = await sql`
    SELECT p.*, u.name AS author, c.name AS category
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ${id};
  `;
  return rows[0];
};

export const createPost = async (
  title: string,
  content: string,
  userId: number,
  categoryId: number
) => {
  const { rows } = await sql`
    INSERT INTO posts (title, content, user_id, category_id)
    VALUES (${title}, ${content}, ${userId}, ${categoryId})
    RETURNING *;
  `;
  return rows[0];
};

export const updatePost = async (
  id: number,
  title: string,
  content: string,
  categoryId: number
) => {
  const { rows } = await sql`
    UPDATE posts
    SET title = ${title}, content = ${content}, category_id = ${categoryId}
    WHERE id = ${id}
    RETURNING *;
  `;
  return rows[0];
};

export const deletePost = async (id: number) => {
  await sql`DELETE FROM posts WHERE id = ${id};`;
};

/* ================= TAGS ================= */
export const getTags = async () => {
  const { rows } = await sql`SELECT * FROM tags ORDER BY name;`;
  return rows;
};

export const createTag = async (name: string) => {
  const { rows } = await sql`
    INSERT INTO tags (name) VALUES (${name}) RETURNING *;
  `;
  return rows[0];
};

/* ================= POST_TAGS ================= */
export const addTagToPost = async (postId: number, tagId: number) => {
  await sql`
    INSERT INTO post_tags (post_id, tag_id)
    VALUES (${postId}, ${tagId})
    ON CONFLICT DO NOTHING;
  `;
};

export const getTagsByPostId = async (postId: number) => {
  const { rows } = await sql`
    SELECT t.* FROM tags t
    JOIN post_tags pt ON t.id = pt.tag_id
    WHERE pt.post_id = ${postId};
  `;
  return rows;
};

/* ================= COMMENTS ================= */
export const getCommentsByPostId = async (postId: number) => {
  const { rows } = await sql`
    SELECT c.id, c.content, u.name AS commenter, c.created_at
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ${postId}
    ORDER BY c.created_at DESC;
  `;
  return rows;
};

export const createComment = async (
  content: string,
  postId: number,
  userId: number
) => {
  const { rows } = await sql`
    INSERT INTO comments (content, post_id, user_id)
    VALUES (${content}, ${postId}, ${userId})
    RETURNING *;
  `;
  return rows[0];
};

/* ================= LIKES ================= */
export const getLikesByPostId = async (postId: number) => {
  const { rows } = await sql`
    SELECT l.id, u.name AS liked_by
    FROM likes l
    JOIN users u ON l.user_id = u.id
    WHERE l.post_id = ${postId};
  `;
  return rows;
};

export const addLike = async (postId: number, userId: number) => {
  const { rows } = await sql`
    INSERT INTO likes (post_id, user_id)
    VALUES (${postId}, ${userId})
    RETURNING *;
  `;
  return rows[0];
};

export const removeLike = async (postId: number, userId: number) => {
  await sql`DELETE FROM likes WHERE post_id = ${postId} AND user_id = ${userId};`;
};
