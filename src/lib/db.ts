import { sql } from '@vercel/postgres';

/* =========================
   USERS
========================= */

// Ambil semua user
export const getUsers = async () => {
  const { rows } = await sql`SELECT id, name, email, role FROM users;`;
  return rows;
};

// Ambil user by ID
export const getUserById = async (id: number) => {
  const { rows } =
    await sql`SELECT id, name, email, role FROM users WHERE id = ${id};`;
  return rows[0];
};

// Tambah user baru
export const addUser = async (
  name: string,
  email: string,
  password: string,
  role = 'reader'
) => {
  const { rows } = await sql`
    INSERT INTO users (name, email, password, role)
    VALUES (${name}, ${email}, ${password}, ${role})
    RETURNING id, name, email, role;
  `;
  return rows[0];
};

// Update user
export const updateUser = async (id: number, name: string, role: string) => {
  const { rows } = await sql`
    UPDATE users SET name = ${name}, role = ${role}
    WHERE id = ${id}
    RETURNING id, name, email, role;
  `;
  return rows[0];
};

// Hapus user
export const deleteUser = async (id: number) => {
  await sql`DELETE FROM users WHERE id = ${id};`;
};

/* =========================
   CATEGORIES
========================= */

export const getCategories = async () => {
  const { rows } = await sql`SELECT * FROM categories;`;
  return rows;
};

export const addCategory = async (name: string, description: string) => {
  const { rows } = await sql`
    INSERT INTO categories (name, description)
    VALUES (${name}, ${description})
    RETURNING *;
  `;
  return rows[0];
};

/* =========================
   POSTS
========================= */

export const getPosts = async () => {
  const { rows } = await sql`
    SELECT p.id, p.title, p.content, p.created_at,
           u.name AS author, c.name AS category
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC;
  `;
  return rows;
};

export const getPostById = async (postId: number) => {
  const { rows } = await sql`
    SELECT p.id, p.title, p.content, p.created_at,
           u.name AS author, c.name AS category
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ${postId};
  `;
  const post = rows[0];
  if (!post) return null;

  const tagsRes = await sql`
    SELECT t.name
    FROM tags t
    JOIN post_tags pt ON pt.tag_id = t.id
    WHERE pt.post_id = ${postId};
  `;

  const commentsRes = await sql`
    SELECT c.id, c.content, c.created_at, u.name AS commenter
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ${postId}
    ORDER BY c.created_at DESC;
  `;

  const likesRes = await sql`
    SELECT COUNT(*)::int AS like_count
    FROM likes
    WHERE post_id = ${postId};
  `;

  return {
    ...post,
    tags: tagsRes.rows.map((r) => r.name),
    comments: commentsRes.rows,
    likes: likesRes.rows[0].like_count,
  };
};

export const addPost = async (
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

/* =========================
   TAGS
========================= */

export const getTags = async () => {
  const { rows } = await sql`SELECT * FROM tags;`;
  return rows;
};

export const addTag = async (name: string) => {
  const { rows } = await sql`
    INSERT INTO tags (name)
    VALUES (${name})
    RETURNING *;
  `;
  return rows[0];
};

export const assignTagToPost = async (postId: number, tagId: number) => {
  await sql`INSERT INTO post_tags (post_id, tag_id) VALUES (${postId}, ${tagId});`;
};

/* =========================
   COMMENTS
========================= */

export const addComment = async (
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

export const deleteComment = async (id: number) => {
  await sql`DELETE FROM comments WHERE id = ${id};`;
};

/* =========================
   LIKES
========================= */

export const likePost = async (postId: number, userId: number) => {
  await sql`
    INSERT INTO likes (post_id, user_id)
    VALUES (${postId}, ${userId})
    ON CONFLICT DO NOTHING;
  `;
};

export const unlikePost = async (postId: number, userId: number) => {
  await sql`
    DELETE FROM likes
    WHERE post_id = ${postId} AND user_id = ${userId};
  `;
};
