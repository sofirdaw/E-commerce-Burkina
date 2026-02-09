import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@ecomm-burkina/database';

// POST /api/admin/restore - Restore database from backup
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { backupFile, type } = await req.json();

    if (!backupFile) {
      return NextResponse.json(
        { error: 'Fichier de sauvegarde requis' },
        { status: 400 }
      );
    }

    const fs = require('fs').promises;
    const path = require('path');

    try {
      // Check if backup file exists
      await fs.access(backupFile);

      if (type === 'database') {
        // RESTAURATION COMPLÈTE DE LA BASE DE DONNÉES
        console.log('🔄 DÉBUT DE LA RESTAURATION COMPLÈTE...');
        
        // Read backup file
        const backupContent = await fs.readFile(backupFile, 'utf8');
        const backup = JSON.parse(backupContent);
        
        if (!backup.data) {
          return NextResponse.json(
            { error: 'Format de sauvegarde invalide' },
            { status: 400 }
          );
        }

        console.log('📋 Backup validé, début de la restauration...');

        // ÉTAPE 1: Suppression complète des données existantes
        console.log('🗑️  Suppression des données existantes...');
        
        try {
          await prisma.$transaction(async (tx) => {
            // Supprimer dans l'ordre inverse des dépendances
            await tx.orderItem.deleteMany();
            console.log('   ✅ OrderItems supprimés');
            
            await tx.review.deleteMany();
            console.log('   ✅ Reviews supprimés');
            
            await tx.order.deleteMany();
            console.log('   ✅ Orders supprimés');
            
            await tx.address.deleteMany();
            console.log('   ✅ Addresses supprimées');
            
            await tx.product.deleteMany();
            console.log('   ✅ Products supprimés');
            
            await tx.category.deleteMany();
            console.log('   ✅ Categories supprimées');
            
            await tx.user.deleteMany();
            console.log('   ✅ Users supprimés');
          });
        } catch (error) {
          console.error('❌ Erreur lors de la suppression:', error);
          throw new Error('Erreur lors de la suppression des données existantes');
        }

        console.log('✅ Toutes les données existantes supprimées');

        // ÉTAPE 2: Restauration des données
        console.log('📥 Restauration des données...');
        
        const { users, products, categories, orders, orderItems, reviews, addresses } = backup.data;

        try {
          await prisma.$transaction(async (tx) => {
            // Restaurer dans l'ordre des dépendances
            
            // 1. Categories
            if (categories && categories.length > 0) {
              await tx.category.createMany({
                data: categories.map((cat: any) => {
                  const { id, ...data } = cat;
                  return data;
                })
              });
              console.log(`   ✅ ${categories.length} catégories restaurées`);
            }

            // 2. Users
            if (users && users.length > 0) {
              await tx.user.createMany({
                data: users.map((user: any) => {
                  const { id, ...data } = user;
                  return data;
                })
              });
              console.log(`   ✅ ${users.length} utilisateurs restaurés`);
            }

            // 3. Products
            if (products && products.length > 0) {
              await tx.product.createMany({
                data: products.map((product: any) => {
                  const { id, ...data } = product;
                  return data;
                })
              });
              console.log(`   ✅ ${products.length} produits restaurés`);
            }

            // 4. Addresses
            if (addresses && addresses.length > 0) {
              await tx.address.createMany({
                data: addresses.map((address: any) => {
                  const { id, ...data } = address;
                  return data;
                })
              });
              console.log(`   ✅ ${addresses.length} adresses restaurées`);
            }

            // 5. Orders
            if (orders && orders.length > 0) {
              await tx.order.createMany({
                data: orders.map((order: any) => {
                  const { id, ...data } = order;
                  return data;
                })
              });
              console.log(`   ✅ ${orders.length} commandes restaurées`);
            }

            // 6. OrderItems
            if (orderItems && orderItems.length > 0) {
              await tx.orderItem.createMany({
                data: orderItems.map((item: any) => {
                  const { id, ...data } = item;
                  return data;
                })
              });
              console.log(`   ✅ ${orderItems.length} articles de commande restaurés`);
            }

            // 7. Reviews
            if (reviews && reviews.length > 0) {
              await tx.review.createMany({
                data: reviews.map((review: any) => {
                  const { id, ...data } = review;
                  return data;
                })
              });
              console.log(`   ✅ ${reviews.length} avis restaurés`);
            }
          });
        } catch (error) {
          console.error('❌ Erreur lors de la restauration:', error);
          throw new Error('Erreur lors de la restauration des données');
        }

        console.log('🎉 RESTAURATION COMPLÈTE TERMINÉE AVEC SUCCÈS!');

      } else if (type === 'data') {
        // RESTAURATION DES FICHIERS DE DONNÉES
        console.log('📁 Restauration des fichiers de données...');
        
        const backupContent = await fs.readFile(backupFile, 'utf8');
        const backup = JSON.parse(backupContent);
        
        if (!backup.data) {
          return NextResponse.json(
            { error: 'Format de sauvegarde invalide' },
            { status: 400 }
          );
        }

        const { settings, analytics } = backup.data;

        // S'assurer que le répertoire data existe
        await fs.mkdir('data', { recursive: true });

        // Restaurer settings
        if (settings) {
          await fs.writeFile('data/settings.json', JSON.stringify(settings, null, 2));
          console.log('✅ Settings restaurés');
        }

        // Restaurer analytics files
        if (analytics) {
          for (const [filename, data] of Object.entries(analytics)) {
            const filePath = `data/${filename}`;
            const dirPath = path.dirname(filePath);
            
            // S'assurer que le répertoire existe
            await fs.mkdir(dirPath, { recursive: true });
            
            // Écrire le fichier
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            console.log(`✅ ${filename} restauré`);
          }
        }

        console.log('📁 Fichiers de données restaurés avec succès');
      }

      return NextResponse.json({
        success: true,
        message: type === 'database' 
          ? '🎉 Base de données restaurée avec succès! Toutes les données ont été complètement restaurées.'
          : '📁 Données restaurées avec succès',
        timestamp: new Date().toISOString(),
        details: type === 'database' 
          ? 'La restauration inclut: utilisateurs, produits, catégories, commandes, adresses, avis et articles de commande.'
          : 'La restauration inclut: paramètres du site et données d\'analytics.'
      });

    } catch (error: any) {
      console.error('❌ ERREUR CRITIQUE lors de la restauration:', error);
      return NextResponse.json(
        { 
          error: `Erreur critique lors de la restauration: ${error?.message || 'Erreur inconnue'}`,
          details: 'La restauration a échoué. Veuillez vérifier le format du fichier de sauvegarde et réessayer.'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ ERREUR API lors de la restauration:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la restauration' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/restore - Delete backup file
export async function DELETE(req: Request) {
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
        { error: 'Fichier de sauvegarde requis' },
        { status: 400 }
      );
    }

    // Security: Only allow files in backups directory
    if (!backupFile.startsWith('backups/')) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const fs = require('fs').promises;
    
    try {
      await fs.unlink(backupFile);
      console.log(`🗑️  Backup supprimé: ${backupFile}`);
      
      return NextResponse.json({
        success: true,
        message: '🗑️ Sauvegarde supprimée avec succès'
      });

    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de la sauvegarde' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Erreur API lors de la suppression:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
