import express from 'express';
import prisma from '../prisma/client';

import { apiKeyAuth } from '../middlewares/apiKeyAuthMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();
router.use(express.json());

router.post("/position", apiKeyAuth, async (req, res, next) => {
    const device = (req as any).device;

    if (!req.body) {
        res.status(400).json({
            status: "error",
            message: "Request body is missing"
        });
        return;
    }

    const { latitude, longitude, timestamp, battery_voltage } = req.body;

    const missingFields = [];
    if (!latitude) missingFields.push("latitude");
    if (!longitude) missingFields.push("longitude");
    if (!timestamp) missingFields.push("timestamp");

    if (missingFields.length > 0) {
        res.status(400).json({
            status: "error",
            message: "Missing required fields in request body",
            missingFields
        });
        return;
    }

    try {
        await prisma.position.create({
            data: {
                deviceId: device.id,
                timestamp: new Date(timestamp),
                latitude,
                longitude
            }
        });
        res.status(200).json({ status: "success", message: "Data recorded" });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/position/:deviceId", authMiddleware, async (req, res, next) => {
    const { deviceId } = req.params;
    const limit = parseInt(req.query.limit as string, 10) || 100; // Default limit to 100 if not provided
    const parsedDeviceId = parseInt(deviceId, 10);
    const userId = (req as any).user.id;

    if (isNaN(limit) || limit <= 0) {
        res.status(400).json({
            status: "error",
            message: "Invalid limit value"
        });
        return;
    }

    try {
        // Check if the device belongs to the authenticated user
        const device = await prisma.device.findFirst({
            where: {
            id: parsedDeviceId,
            users: {
                some: {
                userId: userId
                }
            }
            }
        });

        if (!device) {
            res.status(403).json({
                status: "error",
                message: "You do not have access to this device"
            });
            return;
        }

        const positions = await prisma.position.findMany({
            where: { deviceId: parsedDeviceId },
            orderBy: { timestamp: 'desc' },
            take: limit
        });

        if (positions.length === 0) {
            res.status(404).json({
                status: "error",
                message: "No positions found for this device"
            });
            return;
        }

        res.status(200).json({
            status: "success",
            data: positions
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});


export default router;