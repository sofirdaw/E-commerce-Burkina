@echo off
REM Script de tunnel pour le développement et les mises à jour
echo 🚀 Configuration du tunnel pour Ecomm-Burkina

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé
    pause
    exit /b 1
)

REM Vérifier si pnpm est installé
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pnpm n'est pas installé
    pause
    exit /b 1
)

REM Démarrer le tunnel
echo 🔗 Démarrage du tunnel ngrok...
node scripts/tunnel.js

echo ✅ Tunnel configuré avec succès!
echo.
echo 📋 Instructions pour les mises à jour futures:
echo 1. Faites vos modifications de code
echo 2. Le tunnel se mettra à jour automatiquement
echo 3. Partagez l'URL publique avec votre équipe
echo 4. Pour arrêter: Ctrl+C
pause
