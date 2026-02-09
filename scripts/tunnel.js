const ngrok = require('ngrok');
const { exec } = require('child_process');
const path = require('path');

async function createTunnel() {
  try {
    // Démarrer le serveur de développement Next.js
    console.log('🚀 Démarrage du serveur de développement...');
    const serverProcess = exec('cd apps/web && pnpm dev', (error, stdout, stderr) => {
      if (error) {
        console.error(`Erreur: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      console.log(`Sortie: ${stdout}`);
    });

    // Attendre que le serveur démarre
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Créer le tunnel ngrok
    console.log('🔗 Création du tunnel ngrok...');
    const url = await ngrok.connect({
      addr: 3000, // Port par défaut de Next.js
      authtoken: process.env.NGROK_AUTH_TOKEN, // Optionnel
      region: 'eu', // Région la plus proche
    });

    console.log('✅ Tunnel créé avec succès!');
    console.log(`🌐 URL publique: ${url}`);
    console.log(`📱 URL pour mobile: ${url}`);
    
    // Sauvegarder l'URL dans un fichier
    require('fs').writeFileSync('tunnel-url.txt', url);
    console.log('💾 URL sauvegardée dans tunnel-url.txt');

    // Gérer la fermeture propre
    process.on('SIGINT', async () => {
      console.log('\n🔄 Fermeture du tunnel...');
      await ngrok.disconnect();
      await ngrok.kill();
      serverProcess.kill();
      console.log('✅ Tunnel fermé');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création du tunnel:', error);
    process.exit(1);
  }
}

// Vérifier si le token ngrok est configuré
if (!process.env.NGROK_AUTH_TOKEN) {
  console.log('⚠️  NGROK_AUTH_TOKEN non configuré');
  console.log('📝 Pour configurer un token permanent:');
  console.log('1. Créez un compte sur https://ngrok.com');
  console.log('2. Obtenez votre authtoken');
  console.log('3. Exportez la variable: export NGROK_AUTH_TOKEN=votre_token');
  console.log('🔄 Utilisation du tunnel gratuit (limité à 8 heures)...');
}

createTunnel();
