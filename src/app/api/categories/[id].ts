import { NextApiRequest, NextApiResponse } from 'next';
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../../../lib/db';

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
      const category = await getCategoryById(Number(id));
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      return res.status(200).json(category);

    case 'PUT':
      const { name, description } = req.body;
      const updatedCategory = await updateCategory(
        Number(id),
        name,
        description
      );
      return res.status(200).json(updatedCategory);

    case 'DELETE':
      await deleteCategory(Number(id));
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
