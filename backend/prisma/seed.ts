import { PrismaClient } from '@prisma/client'
import { randomBytes } from 'crypto'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Créer un utilisateur (avec mot de passe hashé)
  const hashedPassword = await bcrypt.hash('adminpassword', 10)

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
    },
  })

  // Générer une clé API aléatoire
  const apiKey = randomBytes(24).toString('hex') // 48 caractères

  // Créer une trottinette / device
  const device = await prisma.device.create({
    data: {
      name: 'Trottinette #001',
      deviceId: 'TROTT001',
      apiKey,
      users: {
        create: {
          userId: user.id,
        },
      },
    },
  })

  console.log('✔ Seed terminé')
  console.log('Utilisateur:', user.email)
  console.log('Mot de passe: adminpassword')
  console.log('Device ID:', device.deviceId)
  console.log('Clé API:', apiKey)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
