import { NextApiRequest, NextApiResponse } from 'next';
import { getPostById, updatePost, deletePost } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      const post = await getPostById(Number(id));
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      return res.status(200).json(post);

    case 'PUT':
      const { title, content, categoryId } = req.body;
      const updatedPost = await updatePost(
        Number(id),
        title,
        content,
        categoryId
      );
      return res.status(200).json(updatedPost);

    case 'DELETE':
      await deletePost(Number(id));
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
