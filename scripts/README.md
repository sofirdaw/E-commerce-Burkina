# 🚀 Tunnel de Développement - Ecomm-Burkina

Ce dossier contient les scripts pour configurer des tunnels sécurisés pour le développement et les mises à jour à distance.

## 📋 Fichiers

- `tunnel.js` - Script principal Node.js pour créer le tunnel ngrok
- `start-tunnel.bat` - Script Windows pour démarrer le tunnel
- `start-tunnel.sh` - Script Linux/macOS pour démarrer le tunnel

## 🛠️ Installation

1. **Installer ngrok** (déjà fait avec `pnpm add ngrok --save-dev`)
2. **Configurer le token (optionnel mais recommandé)**:
   ```bash
   # Créez un compte sur https://ngrok.com
   # Obtenez votre authtoken
   export NGROK_AUTH_TOKEN=39PHnQeL3J0lWkUAw9ddE5AcYgG_2rPmsSRyvyxWboSS42gWf
   ```

## 🚀 Utilisation

### Windows
```bash
# Double-cliquez sur le fichier ou exécutez:
scripts\start-tunnel.bat
```

### Linux/macOS
```bash
# Rendez le script exécutable:
chmod +x scripts/start-tunnel.sh

# Exécutez:
./scripts/start-tunnel.sh
```

### Manuel
```bash
node scripts/tunnel.js
```

## 🌐 Fonctionnalités

- ✅ **Tunnel HTTPS automatique** - URL publique sécurisée
- ✅ **Redémarrage automatique** - Le tunnel se reconnecte si déconnecté
- ✅ **URL sauvegardée** - L'URL est sauvegardée dans `tunnel-url.txt`
- ✅ **Arrêt propre** - Ctrl+C ferme proprement le tunnel et le serveur
- ✅ **Multi-plateforme** - Fonctionne sur Windows, Linux et macOS

## 📱 Utilisation pour les mises à jour

1. **Démarrez le tunnel** avec votre script préféré
2. **Partagez l'URL** affichée avec votre équipe
3. **Faites vos modifications** de code localement
4. **Les changements sont visibles** en temps réel via l'URL publique
5. **Pour arrêter**: Appuyez sur Ctrl+C

## 🔧 Configuration avancée

### Personnaliser le port
Modifiez la ligne `addr: 3000` dans `tunnel.js` si vous utilisez un autre port.

### Région ngrok
Changez `region: 'eu'` pour:
- `us` - États-Unis
- `ap` - Asie-Pacifique
- `au` - Australie

### Domaine personnalisé (payant)
```javascript
const url = await ngrok.connect({
  addr: 3000,
  domain: 'votre-domaine.ngrok.io',
  authtoken: process.env.NGROK_AUTH_TOKEN
});
```

## 🛡️ Sécurité

- Le tunnel utilise HTTPS automatiquement
- Les tokens ngrok sont recommandés pour un usage prolongé
- Le tunnel est temporaire (8h max sans compte)

## 📞 Support

En cas de problème:
1. Vérifiez que Node.js et pnpm sont installés
2. Vérifiez votre connexion internet
3. Consultez les logs d'erreur affichés
4. Redémarrez le script

---
*Créé pour Ecomm-Burkina - Version 1.0*
