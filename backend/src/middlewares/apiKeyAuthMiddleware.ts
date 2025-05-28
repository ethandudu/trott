import { Request, Response, NextFunction } from "express";
import prisma from '../prisma/client';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  (async () => {
    try {
      const apiKey = req.header("X-API-Key");
      if (!apiKey) return res.status(401).json({ error: "Missing API key" });

      const device = await prisma.device.findUnique({ where: { apiKey } });
      if (!device) return res.status(403).json({ error: "Invalid API key" });

      // Attach the device object to the request
      (req as any).device = device;

      next();
    } catch (error) {
      next(error);
    }
  })();
}
