import { NextApiRequest, NextApiResponse } from 'next';
import { getUserById, updateUser, deleteUser } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      const user = await getUserById(Number(id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);

    case 'PUT':
      const { name, role } = req.body;
      const updatedUser = await updateUser(Number(id), name, role);
      return res.status(200).json(updatedUser);

    case 'DELETE':
      await deleteUser(Number(id));
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}