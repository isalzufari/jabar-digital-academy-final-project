import { NextApiRequest, NextApiResponse } from 'next';
import { getCommentById, updateComment, deleteComment } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const comment = await getCommentById(Number(id));
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    return res.status(200).json(comment);
  }

  if (req.method === 'PUT') {
    const { content } = req.body;
    const updatedComment = await updateComment(Number(id), content);
    return res.status(200).json(updatedComment);
  }

  if (req.method === 'DELETE') {
    await deleteComment(Number(id));
    return res.status(204).end();
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
