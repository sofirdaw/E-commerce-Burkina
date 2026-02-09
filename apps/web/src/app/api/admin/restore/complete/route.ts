import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@ecomm-burkina/database';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// POST /api/admin/restore/complete - Complete site restore (code + database + files)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { backupFile } = await req.json();

    if (!backupFile) {
      return NextResponse.json(
        { error: 'Fichier de sauvegarde complet requis' },
        { status: 400 }
      )
    }

    const fs = require('fs').promises;
    const path = require('path');

    try {
      // Check if backup file exists
      await fs.access(backupFile);

      console.log('🔄 DÉBUT DE LA RESTAURATION COMPLÈTE DU SITE...');

      // Extract backup
      const isWindows = process.platform === 'win32';
      const extractDir = `temp-extract-${Date.now()}`;
      
      // Check if it's a JSON backup (alternative format) or ZIP
      const isJsonBackup = backupFile.endsWith('.json');
      
      if (isJsonBackup) {
        // Handle JSON backup format
        console.log('📄 Restauration depuis format JSON...');
        
        const backupContent = await fs.readFile(backupFile, 'utf8');
        const backup = JSON.parse(backupContent);
        
        if (backup.type !== 'complete_backup') {
          return NextResponse.json(
            { error: 'Format de sauvegarde invalide' },
            { status: 400 }
          );
        }

        // Create temp directory structure
        await fs.mkdir(extractDir, { recursive: true });
        
        // Write database backup
        if (backup.data.database) {
          await fs.writeFile(`${extractDir}/database-backup.json`, JSON.stringify(backup.data.database, null, 2));
        }
        
        // Write data backup
        if (backup.data.settings || backup.data.analytics) {
          const dataBackup = {
            timestamp: backup.timestamp,
            version: backup.version,
            data: {
              settings: backup.data.settings,
              analytics: backup.data.analytics
            }
          };
          await fs.writeFile(`${extractDir}/data-backup.json`, JSON.stringify(dataBackup, null, 2));
        }
        
        console.log('✅ Backup JSON extrait');
        
      } else {
        // Handle ZIP backup format
        if (isWindows) {
          // Windows PowerShell extract
          const psCommand = `Expand-Archive -Path "${backupFile}" -DestinationPath "${extractDir}" -Force`;
          const command = `powershell -Command "${psCommand}"`;
          await execAsync(command);
        } else {
          // Unix/Linux/Mac extract
          const command = `mkdir -p "${extractDir}" && tar -xzf "${backupFile}" -C "${extractDir}"`;
          await execAsync(command);
        }
        
        console.log('📦 Archive ZIP extraite avec succès');
      }

      // 1. Restore database
      console.log('📊 Restauration de la base de données...');
      
      try {
        const dbFiles = await fs.readdir(extractDir);
        const dbBackupFile = dbFiles.find((file: string) => file.startsWith('database-') && file.endsWith('.json'));
        
        if (dbBackupFile) {
          const dbBackupPath = path.join(extractDir, dbBackupFile);
          const dbBackupContent = await fs.readFile(dbBackupPath, 'utf8');
          const dbBackup = JSON.parse(dbBackupContent);

          if (dbBackup.data) {
            // Clear existing data
            await prisma.$transaction(async (tx) => {
              await tx.orderItem.deleteMany();
              await tx.review.deleteMany();
              await tx.order.deleteMany();
              await tx.address.deleteMany();
              await tx.product.deleteMany();
              await tx.category.deleteMany();
              await tx.user.deleteMany();
            });

            // Restore data
            const { users, products, categories, orders, orderItems, reviews, addresses } = dbBackup.data;

            await prisma.$transaction(async (tx) => {
              if (categories && categories.length > 0) {
                await tx.category.createMany({
                  data: categories.map((cat: any) => {
                    const { id, ...data } = cat;
                    return data;
                  })
                });
              }

              if (users && users.length > 0) {
                await tx.user.createMany({
                  data: users.map((user: any) => {
                    const { id, ...data } = user;
                    return data;
                  })
                });
              }

              if (products && products.length > 0) {
                await tx.product.createMany({
                  data: products.map((product: any) => {
                    const { id, ...data } = product;
                    return data;
                  })
                });
              }

              if (addresses && addresses.length > 0) {
                await tx.address.createMany({
                  data: addresses.map((address: any) => {
                    const { id, ...data } = address;
                    return data;
                  })
                });
              }

              if (orders && orders.length > 0) {
                await tx.order.createMany({
                  data: orders.map((order: any) => {
                    const { id, ...data } = order;
                    return data;
                  })
                });
              }

              if (orderItems && orderItems.length > 0) {
                await tx.orderItem.createMany({
                  data: orderItems.map((item: any) => {
                    const { id, ...data } = item;
                    return data;
                  })
                });
              }

              if (reviews && reviews.length > 0) {
                await tx.review.createMany({
                  data: reviews.map((review: any) => {
                    const { id, ...data } = review;
                    return data;
                  })
                });
              }
            });

            console.log('✅ Base de données restaurée');
          }
        } else {
          console.log('ℹ️ Aucun fichier de base de données trouvé dans la sauvegarde');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la restauration de la BDD:', error);
      }

      // 2. Restore settings and analytics
      console.log('⚙️ Restauration des settings et analytics...');
      
      try {
        const dbFiles = await fs.readdir(extractDir);
        const dataBackupFile = dbFiles.find((file: string) => file.startsWith('data-') && file.endsWith('.json'));
        
        if (dataBackupFile) {
          const dataBackupPath = path.join(extractDir, dataBackupFile);
          const dataBackupContent = await fs.readFile(dataBackupPath, 'utf8');
          const dataBackup = JSON.parse(dataBackupContent);

          if (dataBackup.data) {
            const { settings, analytics } = dataBackup.data;

            // Ensure data directory exists
            await fs.mkdir('data', { recursive: true });

            // Restore settings
            if (settings) {
              await fs.writeFile('data/settings.json', JSON.stringify(settings, null, 2));
              console.log('✅ Settings restaurés');
            }

            // Restore analytics
            if (analytics) {
              for (const [filename, data] of Object.entries(analytics)) {
                const filePath = `data/${filename}`;
                const dirPath = path.dirname(filePath);
                
                await fs.mkdir(dirPath, { recursive: true });
                await fs.writeFile(filePath, JSON.stringify(data, null, 2));
                console.log(`✅ ${filename} restauré`);
              }
            }
          }
        } else {
          console.log('ℹ️ Aucun fichier de données trouvé dans la sauvegarde');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la restauration des données:', error);
      }

      // 3. Restore source code and files (only for ZIP backups)
      if (!isJsonBackup) {
        console.log('📁 Restauration du code source et fichiers...');
        
        try {
          // Restore apps directory
          const appsSource = path.join(extractDir, 'apps');
          if (await fs.access(appsSource).then(() => true).catch(() => false)) {
            // Remove existing apps directory
            try {
              await fs.rm('apps', { recursive: true, force: true });
            } catch (e) {
              console.log('   ⚠️ apps/ déjà supprimé ou inexistant');
            }
            
            // Copy apps directory
            await fs.cp(appsSource, 'apps', { recursive: true });
            console.log('✅ apps/ restauré');
          } else {
            console.log('   ℹ️ apps/ non trouvé dans la sauvegarde');
          }

          // Restore packages directory
          const packagesSource = path.join(extractDir, 'packages');
          if (await fs.access(packagesSource).then(() => true).catch(() => false)) {
            try {
              await fs.rm('packages', { recursive: true, force: true });
            } catch (e) {
              console.log('   ⚠️ packages/ déjà supprimé ou inexistant');
            }
            
            await fs.cp(packagesSource, 'packages', { recursive: true });
            console.log('✅ packages/ restauré');
          } else {
            console.log('   ℹ️ packages/ non trouvé dans la sauvegarde');
          }

          // Restore public directory
          const publicSource = path.join(extractDir, 'public');
          if (await fs.access(publicSource).then(() => true).catch(() => false)) {
            try {
              await fs.rm('public', { recursive: true, force: true });
            } catch (e) {
              console.log('   ⚠️ public/ déjà supprimé ou inexistant');
            }
            
            await fs.cp(publicSource, 'public', { recursive: true });
            console.log('✅ public/ restauré');
          } else {
            console.log('   ℹ️ public/ non trouvé dans la sauvegarde');
          }

          // Restore root files
          const rootFiles = ['package.json', 'package-lock.json', 'next.config.js', 'tailwind.config.js', 'tsconfig.json', '.env.local', 'README.md'];
          
          for (const file of rootFiles) {
            const sourceFile = path.join(extractDir, file);
            if (await fs.access(sourceFile).then(() => true).catch(() => false)) {
              await fs.copyFile(sourceFile, file);
              console.log(`✅ ${file} restauré`);
            } else {
              console.log(`   ℹ️ ${file} non trouvé dans la sauvegarde`);
            }
          }

        } catch (error) {
          console.error('❌ Erreur lors de la restauration des fichiers:', error);
        }
      }

      // Clean up extraction directory
      try {
        await fs.rm(extractDir, { recursive: true, force: true });
        console.log('🗑️ Répertoire temporaire nettoyé');
      } catch (e) {
        console.log('⚠️ Erreur lors du nettoyage du répertoire temporaire');
      }

      console.log('🎉 RESTAURATION COMPLÈTE TERMINÉE AVEC SUCCÈS!');

      return NextResponse.json({
        success: true,
        message: '🎉 Site complètement restauré avec succès!',
        timestamp: new Date().toISOString(),
        restored: [
          '📁 Code source complet',
          '📊 Base de données',
          '⚙️ Settings et analytics',
          '📁 Fichiers publics',
          '📄 Fichiers de configuration'
        ],
        nextSteps: [
          '🔄 Redémarrez le serveur de développement',
          '🌐 Vérifiez que le site fonctionne correctement',
          '📊 Testez toutes les fonctionnalités principales'
        ]
      });

    } catch (error: any) {
      console.error('❌ ERREUR CRITIQUE lors de la restauration complète:', error);
      return NextResponse.json(
        { 
          error: `Erreur critique lors de la restauration complète: ${error?.message || 'Erreur inconnue'}`,
          details: 'La restauration complète a échoué. Veuillez vérifier le format du fichier de sauvegarde et réessayer.'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Erreur API restauration complète:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la restauration complète' },
      { status: 500 }
    );
  }
}
