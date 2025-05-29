import express from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prisma/client';
import { generateToken } from '../utils/jwt';

import { sendWelcomeEmail } from '../utils/mailer';

const router = express.Router();

// Route pour l'inscription
router.post('/register', async (req, res) => {
    const { email, password } = req.body || {};
    
    // Validation sans utiliser de return prématuré
    if (!req.body || !email || !password) {
        const missingFields = [];
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');
        res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
    } else {
        try {
            const existing = await prisma.user.findUnique({ where: { email } });
            
            if (existing) {
                res.status(400).json({ error: 'Email already used' });
            } else {
                const hash = await bcrypt.hash(password, 10);
                const user = await prisma.user.create({
                    data: {
                        email,
                        password: hash,
                    },
                });
                
                const token = generateToken({ id: user.id, email: user.email });
                res.status(201).json({ 
                    token, 
                    user: { id: user.id, email: user.email } 
                });

                sendWelcomeEmail(user.email)
                    .catch(err => console.error('Email error:', err));
                
            }
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Route pour la connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};

    // Validation sans utiliser de return prématuré
    if (!req.body || !email || !password) {
        const missingFields = [];
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');
        res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
    } else {
        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                res.status(401).json({ error: 'Invalid credentials' });
            } else {
                const valid = await bcrypt.compare(password, user.password);

                if (!valid) {
                    res.status(401).json({ error: 'Invalid credentials' });
                } else {
                    const token = generateToken({ id: user.id, email: user.email });
                    res.json({ token, user: { id: user.id, email: user.email }});
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

export default router;