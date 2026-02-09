import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/admin/backup/download - Download backup file
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const filePath = searchParams.get('file');

    if (!filePath) {
      return NextResponse.json(
        { error: 'Fichier non spécifié' },
        { status: 400 }
      );
    }

    // Security: Only allow files in backups directory
    if (!filePath.startsWith('backups/')) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const fs = require('fs').promises;
    const path = require('path');

    try {
      // Check if file exists
      await fs.access(filePath);

      // Get file stats
      const stats = await fs.stat(filePath);
      
      // Read file
      const fileBuffer = await fs.readFile(filePath);
      
      // Get filename from path
      const filename = path.basename(filePath);

      // Return file as download
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': fileBuffer.length.toString(),
        },
      });

    } catch (error) {
      console.error('Download error:', error);
      return NextResponse.json(
        { error: 'Fichier non trouvé' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Download API error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement' },
      { status: 500 }
    );
  }
}
