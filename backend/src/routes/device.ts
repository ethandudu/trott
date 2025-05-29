import express from 'express';
import prisma from '../prisma/client';

const router = express.Router();
import { authMiddleware } from '../middlewares/authMiddleware';
import { isArgumentsObject } from 'util/types';

// GET: Retrieve all devices for the authenticated user
router.get('/device', authMiddleware, async (req, res) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        const devices = await prisma.device.findMany({
            where: {
                users: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                users: true,
                positions: true,
            },
        });
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch devices' });
    }
});

// POST: Create a new device
router.post('/device', authMiddleware, async (req, res) => {
    try {
        const { name, deviceId, apiKey } = req.body;
        const newDevice = await prisma.device.create({
            data: { name, deviceId, apiKey },
        });
        res.status(201).json(newDevice);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create device' });
    }
});

// PUT: Update an existing device (partial update, excluding apiKey and deviceId)
router.put('/device/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, userIds } = req.body;
        const userId = (req as any).user?.id;

        // Check if the device exists
        const device = await prisma.device.findUnique({
            where: { id: Number(id) },
            include: { users: true },
        });

        if (!device) {
            res.status(404).json({ error: 'Device not found' });
            return;
        }

        // Check if the authenticated user is associated with the device
        const isUserAuthorized = device.users.some(user => user.userId === userId);
        if (!isUserAuthorized) {
            res.status(403).json({ error: 'You are not authorized to update this device' });
            return;
        }

        const updatedDevice = await prisma.device.update({
            where: { id: Number(id) },
            data: {
                ...(name && { name }),
                ...(userIds && {
                    users: {
                        set: userIds.map((userId: number) => ({ id: userId })),
                    },
                }),
            },
        });
        res.status(200).json(updatedDevice);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update device' });
    }
});

// DELETE: Remove a device
router.delete('/device/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;

        // Check if the device exists
        const device = await prisma.device.findUnique({
            where: { id: Number(id) },
            include: { users: true },
        });

        if (!device) {
            res.status(404).json({ error: 'Device not found' });
            return;
        }

        // Check if the authenticated user is associated with the device
        const isUserAuthorized = device.users.some(user => user.userId === userId);
        if (!isUserAuthorized) {
            res.status(403).json({ error: 'You are not authorized to delete this device' });
            return;
        }

        await prisma.device.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete device' });
    }
});

export default router;