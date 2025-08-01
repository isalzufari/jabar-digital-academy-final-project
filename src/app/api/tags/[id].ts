import { NextApiRequest, NextApiResponse } from 'next';
import { getTagById, updateTag, deleteTag } from '../../../lib/db';

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
      const tag = await getTagById(Number(id));
      if (!tag) {
        return res.status(404).json({ message: 'Tag not found' });
      }
      return res.status(200).json(tag);

    case 'PUT':
      const { name, description } = req.body;
      const updatedTag = await updateTag(Number(id), name, description);
      return res.status(200).json(updatedTag);

    case 'DELETE':
      await deleteTag(Number(id));
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
