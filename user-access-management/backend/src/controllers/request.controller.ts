import { Request, Response } from 'express';
import { AppDataSource } from '../../ormconfig';
import { Request as RequestEntity } from '../entities/Request';
import { User } from '../entities/User';
import { Software } from '../entities/Software';

export const createRequest = async (req: Request, res: Response): Promise<void> => {
  const { softwareId, accessType, reason } = req.body;
  const userId = (req as any).user?.id; // Get user ID from authenticated token

  if (!userId) {
    res.status(403).json({ message: 'User not authenticated' });
    return;
  }

  if (!softwareId || !accessType || !reason) {
    res.status(400).json({ message: 'Missing required fields: softwareId, accessType, reason' });
    return;
  }

  if (!['Read', 'Write', 'Admin'].includes(accessType)) {
    res.status(400).json({ message: 'Invalid accessType. Must be Read, Write, or Admin.' });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const softwareRepository = AppDataSource.getRepository(Software);
    const requestRepository = AppDataSource.getRepository(RequestEntity);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      res.status(404).json({ message: 'Authenticated user not found' });
      return;
    }

    const software = await softwareRepository.findOneBy({ id: softwareId });
    if (!software) {
      res.status(404).json({ message: 'Software not found' });
      return;
    }

    const newRequest = new RequestEntity();
    newRequest.user = user;
    newRequest.software = software;
    newRequest.accessType = accessType;
    newRequest.reason = reason;
    newRequest.status = 'Pending'; // Default status

    await requestRepository.save(newRequest);

    res.status(201).json(newRequest);
    return;
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export const getPendingRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const requestRepository = AppDataSource.getRepository(RequestEntity);

    // Fetch pending requests and include related user and software information
    const pendingRequests = await requestRepository.find({
      where: { status: 'Pending' },
      relations: ['user', 'software'], // Specify relations to load
    });

    // Optionally, you might want to select specific fields from user/software
    // to avoid exposing sensitive data like user passwords.
    // For example, mapping over pendingRequests:
    const sanitizedRequests = pendingRequests.map(request => ({
      id: request.id,
      accessType: request.accessType,
      reason: request.reason,
      status: request.status,
      user: {
        id: request.user.id,
        username: request.user.username,
        role: request.user.role,
      },
      software: {
        id: request.software.id,
        name: request.software.name,
        description: request.software.description,
      },
      // Add other request fields if necessary, like createdAt, updatedAt
    }));

    res.status(200).json(sanitizedRequests);
    return;
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export const updateRequestStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body; // Expected: "Approved" or "Rejected"

  if (!id || !status) {
    res.status(400).json({ message: 'Missing request ID or status' });
    return;
  }

  if (!['Approved', 'Rejected'].includes(status)) {
    res.status(400).json({ message: 'Invalid status. Must be Approved or Rejected.' });
    return;
  }

  try {
    const requestRepository = AppDataSource.getRepository(RequestEntity);
    const requestId = parseInt(id, 10);

    if (isNaN(requestId)) {
        res.status(400).json({ message: 'Invalid request ID format' });
        return;
    }

    const requestToUpdate = await requestRepository.findOneBy({ id: requestId });

    if (!requestToUpdate) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }

    // Optionally, check if the request is already resolved
    if (requestToUpdate.status !== 'Pending') {
        res.status(400).json({ message: `Request is already ${requestToUpdate.status.toLowerCase()}` });
        return;
    }

    requestToUpdate.status = status;
    await requestRepository.save(requestToUpdate);

    res.status(200).json(requestToUpdate);
    return;
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export const getMyRequests = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id;

  if (!userId) {
    res.status(403).json({ message: 'User not authenticated' });
    return;
  }

  try {
    const requestRepository = AppDataSource.getRepository(RequestEntity);
    const userRequests = await requestRepository.find({
      where: { user: { id: userId } },
      relations: ['software', 'user'], // Include software and user details
      order: { createdAt: 'DESC' } // Add order by creation date
    });

    const sanitizedRequests = userRequests.map(request => ({
      id: request.id,
      accessType: request.accessType,
      reason: request.reason,
      status: request.status,
      software: {
        id: request.software.id,
        name: request.software.name,
      },
      createdAt: request.createdAt, // Add createdAt
      updatedAt: request.updatedAt, // Add updatedAt
    }));

    res.status(200).json(sanitizedRequests);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
