#!/bin/bash

# Script de tunnel pour le développement et les mises à jour
echo "🚀 Configuration du tunnel pour Ecomm-Burkina"

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérifier si pnpm est installé
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm n'est pas installé"
    exit 1
fi

# Démarrer le tunnel
echo "🔗 Démarrage du tunnel ngrok..."
node scripts/tunnel.js

echo "✅ Tunnel configuré avec succès!"
echo ""
echo "📋 Instructions pour les mises à jour futures:"
echo "1. Faites vos modifications de code"
echo "2. Le tunnel se mettra à jour automatiquement"
echo "3. Partagez l'URL publique avec votre équipe"
echo "4. Pour arrêter: Ctrl+C"
