import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  console.log('👤 Création de l\'utilisateur admin par défaut...');

  const adminEmail = 'admin@ecomm-burkina.com';
  const adminPassword = 'admin123456';

  // Vérifier si l'admin existe déjà
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('ℹ️ L\'utilisateur admin existe déjà.');
    return;
  }

  // Créer le mot de passe hashé
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // Créer l'utilisateur admin
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'Administrateur Ecomm Burkina',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Utilisateur admin créé avec succès!');
  console.log(`📧 Email: ${adminEmail}`);
  console.log(`🔑 Mot de passe: ${adminPassword}`);
}

async function main() {
  try {
    await createAdminUser();
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
