import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@ecomm-burkina/database';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// POST /api/admin/backup/complete - Complete site backup (code + database + files)
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { backupLocation = 'local' } = body; // 'local' or 'external'

    console.log('🔄 DÉBUT DE LA SAUVEGARDE COMPLÈTE DU SITE.');
    console.log(`📍 Destination: ${backupLocation === 'external' ? 'Disque dur externe' : 'Local'}`);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    
    // Determine backup destination
    let backupDir, completeBackupFile;
    
    if (backupLocation === 'external') {
      // Try to find external drives (Windows)
      const { execSync } = require('child_process');
      try {
        const drives = execSync('wmic logicaldisk get size,freespace,caption', { encoding: 'utf8' });
        const driveLines = drives.split('\n').slice(1).filter((line: string) => line.trim());
        
        // Look for external drives (typically not C:)
        const externalDrives = driveLines.filter((line: string) => {
          const drive = line.split(/\s+/)[0];
          return drive && drive !== 'C:' && drive.match(/^[A-Z]:$/);
        });
        
        if (externalDrives.length > 0) {
          const externalDrive = externalDrives[0].split(/\s+/)[0];
          backupDir = `${externalDrive}\\EcommBurkina-Backups`;
          console.log(`💾 Disque externe détecté: ${externalDrive}`);
        } else {
          // Fallback to local if no external drive found
          backupDir = 'backups';
          console.log('⚠️ Aucun disque externe détecté, utilisation du stockage local');
        }
      } catch (error) {
        backupDir = 'backups';
        console.log('⚠️ Erreur détection disque externe, utilisation du stockage local');
      }
    } else {
      backupDir = 'backups';
    }
    
    completeBackupFile = `${backupDir}/ecomm-burkina-complete-${timestamp}.zip`;
    
    // Ensure backup directory exists
    const fs = require('fs').promises;
    const path = require('path');
    
    try {
      await fs.access(backupDir);
    } catch {
      await fs.mkdir(backupDir, { recursive: true });
    }

    try {
      console.log('🔄 DÉBUT DE LA SAUVEGARDE COMPLÈTE DU SITE...');

      // 1. Backup database
      console.log('📊 Sauvegarde de la base de données...');
      const databaseBackup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {}
      };

      const [
        users,
        products,
        categories,
        orders,
        orderItems,
        reviews,
        addresses
      ] = await Promise.all([
        prisma.user.findMany(),
        prisma.product.findMany(),
        prisma.category.findMany(),
        prisma.order.findMany(),
        prisma.orderItem.findMany(),
        prisma.review.findMany(),
        prisma.address.findMany()
      ]);

      databaseBackup.data = {
        users,
        products,
        categories,
        orders,
        orderItems,
        reviews,
        addresses
      };

      await fs.writeFile(`${backupDir}/database-${timestamp}.json`, JSON.stringify(databaseBackup, null, 2));
      console.log('✅ Base de données sauvegardée');

      // 2. Backup settings and analytics
      console.log('⚙️ Sauvegarde des settings et analytics...');
      let settingsData = {};
      let analyticsData = {};
      
      try {
        const settingsFile = 'data/settings.json';
        await fs.access(settingsFile);
        const settingsContent = await fs.readFile(settingsFile, 'utf8');
        settingsData = JSON.parse(settingsContent);
      } catch {
        console.log('ℹ️ Aucun fichier settings à sauvegarder');
      }

      try {
        const dataDir = 'data';
        await fs.access(dataDir);
        const files = await fs.readdir(dataDir);
        const analyticsFiles = files.filter((file: string) => file.startsWith('analytics-') && file.endsWith('.json'));
        
        for (const file of analyticsFiles) {
          const filePath = `${dataDir}/${file}`;
          const content = await fs.readFile(filePath, 'utf8');
          (analyticsData as any)[file] = JSON.parse(content);
        }
      } catch {
        console.log('ℹ️ Aucun fichier analytics à sauvegarder');
      }

      const dataBackup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {
          settings: settingsData,
          analytics: analyticsData
        }
      };

      await fs.writeFile(`${backupDir}/data-${timestamp}.json`, JSON.stringify(dataBackup, null, 2));
      console.log('✅ Settings et analytics sauvegardés');

      // 3. Create complete backup using system commands
      console.log('📦 Création de l\'archive complète...');
      
      // On Windows, use PowerShell to create ZIP
      const isWindows = process.platform === 'win32';
      
      if (isWindows) {
        // PowerShell command to create ZIP
        const psCommand = `Compress-Archive -Path "apps,packages,public,data,*.json,*.md,*.js,*.ts,*.json" -DestinationPath "${completeBackupFile}" -Force`;
        const command = `powershell -Command "${psCommand}"`;
        
        try {
          await execAsync(command);
          console.log('✅ Archive Windows créée');
          
          // Get file size
          const stats = await fs.stat(completeBackupFile);
          const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
          
          console.log(`🎉 SAUVEGARDE COMPLÈTE TERMINÉE! (${sizeInMB} MB)`);

          return NextResponse.json({
            success: true,
            message: 'Sauvegarde complète du site créée avec succès',
            file: completeBackupFile,
            size: stats.size,
            sizeInMB,
            timestamp,
            format: 'ZIP',
            includes: [
              '📁 Code source complet (apps/, packages/)',
              '📁 Fichiers publics (public/)',
              '📊 Base de données complète',
              '⚙️ Settings et analytics',
              '📄 Fichiers de configuration'
            ],
            note: 'Ce fichier ZIP peut être utilisé pour restaurer le site dans un autre projet ou serveur'
          });
          
        } catch (error) {
          console.log('⚠️ PowerShell échoué, tentative alternative...');
          
          // Alternative: Use Node.js to create proper ZIP
          try {
            const archiver = require('archiver');
            const path = require('path');
            const fs = require('fs');
            const output = fs.createWriteStream(completeBackupFile);
            const archive = archiver('zip', { zlib: { level: 9 } });

            archive.pipe(output);

            // Get to the root directory - use absolute path
            const rootDir = 'C:\\Users\\USER\\Downloads\\ecomm-burkina';
            console.log(`   📁 Racine du projet: ${rootDir}`);
            console.log(`   🔍 Vérification des répertoires...`);

            // Check what directories exist
            const appsDir = path.join(rootDir, 'apps');
            const packagesDir = path.join(rootDir, 'packages');
            const publicDir = path.join(rootDir, 'public');
            
            console.log(`   📂 apps/ existe: ${fs.existsSync(appsDir)}`);
            console.log(`   📂 packages/ existe: ${fs.existsSync(packagesDir)}`);
            console.log(`   📂 public/ existe: ${fs.existsSync(publicDir)}`);

            // Add source code directories from root
            if (fs.existsSync(appsDir)) {
              const appsStats = fs.statSync(appsDir);
              console.log(`   📊 apps/ taille: ${(appsStats.size / 1024 / 1024).toFixed(2)} MB`);
              archive.directory(appsDir, 'apps/');
              console.log('   ✅ apps/ ajouté');
            } else {
              console.log('   ❌ apps/ non trouvé');
            }

            if (fs.existsSync(packagesDir)) {
              const packagesStats = fs.statSync(packagesDir);
              console.log(`   📊 packages/ taille: ${(packagesStats.size / 1024 / 1024).toFixed(2)} MB`);
              archive.directory(packagesDir, 'packages/');
              console.log('   ✅ packages/ ajouté');
            } else {
              console.log('   ❌ packages/ non trouvé');
            }

            if (fs.existsSync(publicDir)) {
              const publicStats = fs.statSync(publicDir);
              console.log(`   📊 public/ taille: ${(publicStats.size / 1024 / 1024).toFixed(2)} MB`);
              archive.directory(publicDir, 'public/');
              console.log('   ✅ public/ ajouté');
            } else {
              console.log('   ❌ public/ non trouvé');
            }

            // Add root files from root directory
            const rootFiles = ['package.json', 'package-lock.json', 'next.config.js', 'tailwind.config.js', 'tsconfig.json', '.env.local', 'README.md'];
            
            for (const file of rootFiles) {
              const filePath = path.join(rootDir, file);
              if (fs.existsSync(filePath)) {
                const fileStats = fs.statSync(filePath);
                console.log(`   📄 ${file} trouvé (${fileStats.size} bytes)`);
                archive.file(filePath, { name: file });
                console.log(`   ✅ ${file} ajouté`);
              } else {
                console.log(`   ⚠️ ${file} non trouvé`);
              }
            }

            // Add backup files
            const dbBackupPath = `${backupDir}/database-${timestamp}.json`;
            const dataBackupPath = `${backupDir}/data-${timestamp}.json`;
            
            if (fs.existsSync(dbBackupPath)) {
              const dbStats = fs.statSync(dbBackupPath);
              console.log(`   📊 database backup taille: ${(dbStats.size / 1024 / 1024).toFixed(2)} MB`);
              archive.file(dbBackupPath, { name: `database-${timestamp}.json` });
            }
            
            if (fs.existsSync(dataBackupPath)) {
              const dataStats = fs.statSync(dataBackupPath);
              console.log(`   📊 data backup taille: ${(dataStats.size / 1024 / 1024).toFixed(2)} MB`);
              archive.file(dataBackupPath, { name: `data-${timestamp}.json` });
            }

            // Track archive creation
            let totalBytes = 0;
            archive.on('data', (chunk: Buffer) => {
              totalBytes += chunk.length;
            });

            await new Promise((resolve, reject) => {
              output.on('close', async () => {
                console.log(`   📊 Archive finale: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
                
                try {
                  const stats = fs.statSync(completeBackupFile);
                  const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
                  
                  console.log('✅ Archive ZIP Node.js créée');
                  console.log(`🎉 SAUVEGARDE COMPLÈTE TERMINÉE! (${sizeInMB} MB)`);

                  return NextResponse.json({
                    success: true,
                    message: 'Sauvegarde complète du site créée avec succès',
                    file: completeBackupFile,
                    size: stats.size,
                    sizeInMB,
                    timestamp,
                    format: 'ZIP',
                    includes: [
                      '📁 Code source complet (apps/, packages/)',
                      '📁 Fichiers publics (public/)',
                      '📊 Base de données complète',
                      '⚙️ Settings et analytics',
                      '📄 Fichiers de configuration'
                    ],
                    note: 'Ce fichier ZIP peut être utilisé pour restaurer le site dans un autre projet ou serveur'
                  });
                } catch (statError) {
                  console.error('❌ Erreur lors de la lecture du fichier:', statError);
                  reject(statError);
                }
              });
              output.on('error', reject);
              archive.finalize();
            });
            
          } catch (altError) {
            console.error('❌ Alternative ZIP échoué:', altError);
            throw new Error('Impossible de créer l\'archive de sauvegarde');
          }
        }
      } else {
        // Unix/Linux/Mac - use tar command
        const command = `tar -czf "${completeBackupFile}" apps/ packages/ public/ data/ *.json *.md *.js *.ts *.env*`;
        await execAsync(command);
        console.log('✅ Archive Unix créée');
        
        // Get file size
        const stats = await fs.stat(completeBackupFile);
        const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
        
        console.log(`🎉 SAUVEGARDE COMPLÈTE TERMINÉE! (${sizeInMB} MB)`);

        return NextResponse.json({
          success: true,
          message: 'Sauvegarde complète du site créée avec succès',
          file: completeBackupFile,
          size: stats.size,
          sizeInMB,
          timestamp,
          format: 'TAR.GZ',
          includes: [
            '📁 Code source complet (apps/, packages/)',
            '📁 Fichiers publics (public/)',
            '📊 Base de données complète',
            '⚙️ Settings et analytics',
            '📄 Fichiers de configuration'
          ],
          note: 'Ce fichier TAR.GZ peut être utilisé pour restaurer le site dans un autre projet ou serveur'
        });
      }

    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde complète:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde complète du site' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Erreur API sauvegarde complète:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    );
  }
}
