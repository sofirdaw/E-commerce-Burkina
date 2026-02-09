import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@ecomm-burkina/database';

// POST /api/admin/backup - Create database backup
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupDir = 'backups';
    const backupFile = `${backupDir}/ecomm-burkina-backup-${timestamp}.json`;

    // Ensure backup directory exists
    const fs = require('fs').promises;
    try {
      await fs.access(backupDir);
    } catch {
      await fs.mkdir(backupDir, { recursive: true });
    }

    try {
      // Get all data from database
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

      // Create backup object
      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {
          users,
          products,
          categories,
          orders,
          orderItems,
          reviews,
          addresses
        }
      };

      // Save backup as JSON
      await fs.writeFile(backupFile, JSON.stringify(backupData, null, 2));

      // Also backup settings and analytics files
      const dataBackupFile = `${backupDir}/ecomm-burkina-data-${timestamp}.json`;
      
      let settingsData = {};
      let analyticsData = {};
      
      try {
        // Backup settings
        const settingsFile = 'data/settings.json';
        await fs.access(settingsFile);
        const settingsContent = await fs.readFile(settingsFile, 'utf8');
        settingsData = JSON.parse(settingsContent);
      } catch {
        console.log('No settings file to backup');
      }

      try {
        // Backup analytics files
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
        console.log('No analytics files to backup');
      }

      // Save data backup
      const dataBackup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {
          settings: settingsData,
          analytics: analyticsData
        }
      };

      await fs.writeFile(dataBackupFile, JSON.stringify(dataBackup, null, 2));

      return NextResponse.json({
        success: true,
        message: 'Sauvegarde créée avec succès',
        files: {
          database: backupFile,
          data: dataBackupFile
        },
        timestamp
      });

    } catch (error) {
      console.error('Backup error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde de la base de données' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Backup API error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    );
  }
}

// GET /api/admin/backup - List available backups
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const fs = require('fs').promises;
    const backupDir = 'backups';
    
    let backups = [];
    try {
      const files = await fs.readdir(backupDir);
      
      for (const file of files) {
        const filePath = `${backupDir}/${file}`;
        const stats = await fs.stat(filePath);
        
        backups.push({
          name: file,
          path: filePath,
          size: stats.size,
          created: stats.birthtime,
          type: file.includes('backup-') ? 'database' : 'data'
        });
      }
      
      // Sort by creation date (newest first)
      backups.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      
    } catch (error) {
      console.log('No backups directory or empty');
    }

    return NextResponse.json({ backups });

  } catch (error) {
    console.error('List backups error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la lecture des sauvegardes' },
      { status: 500 }
    );
  }
}
