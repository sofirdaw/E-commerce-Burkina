# 📧 Configuration du Système d'Emails - Ecomm-Burkina

## 🎯 Objectif
Configurer un système d'envoi d'emails fiable qui arrive directement dans votre boîte mail sans spam.

## 🔧 Options Disponibles

### Option 1: Resend (Recommandé) ⭐
**Avantages:**
- ✅ Meilleure délivrabilité (pas de spam)
- ✅ Configuration simple
- ✅ Templates HTML modernes
- ✅ Analytics et tracking
- ✅ 100 emails gratuits par jour

**Étapes:**
1. Créez un compte sur [Resend.com](https://resend.com)
2. Vérifiez votre domaine email
3. Récupérez votre clé API
4. Configurez les variables d'environnement

### Option 2: SMTP (Alternative)
**Avantages:**
- ✅ Gratuit avec Gmail
- ✅ Contrôle total
- ✅ Pas de dépendance externe

**Inconvénients:**
- ⚠️ Plus susceptible au spam
- ⚠️ Configuration plus complexe

---

## 🚀 Configuration Rapide

### 1. Avec Resend (Recommandé)

```bash
# 1. Installez Resend
npm install resend

# 2. Configurez votre .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=votre-email@exemple.com
```

### 2. Avec SMTP (Gmail)

```bash
# 1. Activez l'authentification 2 facteurs sur Gmail
# 2. Générez un mot de passe d'application
# 3. Configurez votre .env.local
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
CONTACT_EMAIL=votre-email@exemple.com
```

---

## 📝 Variables d'Environnement

Copiez `.env.example` vers `.env.local` et configurez:

```bash
# Pour Resend
RESEND_API_KEY="votre-clé-api-resend"
CONTACT_EMAIL="contact@ecomm-burkina.bf"

# Pour SMTP (alternative)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-app"
CONTACT_EMAIL="contact@ecomm-burkina.bf"
```

---

## 🎨 Templates Email

Le système inclut des templates HTML professionnels:

- 🎨 Design moderne avec vos couleurs
- 📱 Responsive sur mobile
- 🇧🇫 Branding Ecomm-Burkina
- ⏰ Horodatage automatique
- 📋 Détails du message formatés

---

## 🧪 Test du Système

### 1. Test Local
```bash
pnpm run dev
# Allez sur http://localhost:3002/about
# Remplissez le formulaire de contact
```

### 2. Vérification
- ✅ Email reçu dans votre boîte
- ✅ Format HTML correct
- ✅ Pas dans les spams
- ✅ Réponse automatique fonctionnelle

---

## 🛡️ Éviter le Spam

### Avec Resend:
- ✅ Domaine vérifié automatiquement
- ✅ IP réputation excellente
- ✅ DKIM/SPF configurés

### Avec SMTP:
- 🔧 Configurez SPF/DKIM
- 🔧 Utilisez un domaine personnalisé
- 🔧 Évitez les mots spam

---

## 📊 Monitoring

### Logs Console:
```bash
✅ Email envoyé avec succès via Resend
⚠️ Resend échoué, tentative avec Nodemailer...
✅ Email envoyé avec succès via Nodemailer
❌ Erreur lors de l'envoi de l'email
```

### Analytics Resend:
- 📈 Taux d'ouverture
- 📈 Taux de clic
- 📈 Livraison

---

## 🔧 Dépannage

### Problèmes Communs:

**Email non reçu:**
1. Vérifiez le dossier spam
2. Vérifiez les variables d'environnement
3. Regardez les logs console

**Erreur SMTP:**
1. Vérifiez le mot de passe d'application Gmail
2. Activez "accès aux apps moins sécurisées"
3. Vérifiez les ports SMTP

**Erreur Resend:**
1. Vérifiez la clé API
2. Vérifiez le domaine vérifié
3. Vérifiez le quota d'envois

---

## 🎯 Recommandation

**Utilisez Resend pour:**
- ✅ Meilleure délivrabilité
- ✅ Configuration simple
- ✅ Analytics détaillés
- ✅ Maintenance réduite

**Utilisez SMTP pour:**
- ✅ Budget limité
- ✅ Contrôle total
- ✅ Pas de dépendance externe

---

## 📞 Support

En cas de problème:
1. 📋 Vérifiez les logs console
2. 📋 Testez avec un autre email
3. 📋 Contactez le support Resend/Gmail

**Le système est maintenant prêt à recevoir des emails de contact!** 🎉
