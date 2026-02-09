# 📸 GUIDE CONFIGURATION CLOUDINARY

## 🎯 Pourquoi Cloudinary ?

Cloudinary est un service cloud pour gérer les images et vidéos avec :
- ✅ Upload rapide et sécurisé
- ✅ Optimisation automatique des images
- ✅ Transformations (resize, crop, compress)
- ✅ CDN mondial (chargement rapide)
- ✅ **Plan gratuit généreux** : 25GB stockage, 25GB bande passante/mois

---

## 🚀 ÉTAPES DE CONFIGURATION

### 1. Créer un compte Cloudinary (GRATUIT)

1. Aller sur : https://cloudinary.com/users/register_free
2. S'inscrire avec email
3. Vérifier l'email de confirmation
4. Se connecter au dashboard

### 2. Récupérer les identifiants

Une fois connecté, vous verrez le dashboard avec :

```
Cloud Name: votre-cloud-name
API Key: 123456789012345
API Secret: AbCdEfGhIjKlMnOpQrStUvWxYz
```

### 3. Ajouter au fichier .env

Ouvrir le fichier `.env` à la racine du projet et ajouter :

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="votre-cloud-name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="AbCdEfGhIjKlMnOpQrStUvWxYz"
```

**⚠️ IMPORTANT** :
- Remplacez les valeurs par vos vrais identifiants
- `NEXT_PUBLIC_` rend la variable accessible côté client
- `API_SECRET` reste côté serveur (sécurisé)

### 4. Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Relancer
pnpm dev
```

---

## ✅ VÉRIFIER LA CONFIGURATION

### Test 1 : Créer un produit avec image

1. Aller sur : http://localhost:3000/admin/products/new
2. Remplir le formulaire
3. Cliquer sur "Choisir une image"
4. Sélectionner une image depuis votre ordinateur
5. Attendre l'upload (quelques secondes)
6. L'image devrait s'afficher
7. Sauvegarder le produit

### Test 2 : Vérifier sur Cloudinary

1. Se connecter à https://cloudinary.com
2. Aller dans **Media Library**
3. Dossier `ecomm-burkina/products`
4. Vous devriez voir votre image uploadée

---

## 📁 STRUCTURE DES DOSSIERS CLOUDINARY

```
ecomm-burkina/
├── products/           # Images produits
│   ├── image1.jpg
│   ├── image2.png
│   └── ...
├── users/             # Avatars utilisateurs (futur)
└── categories/        # Images catégories (futur)
```

---

## 🎨 TRANSFORMATIONS AUTOMATIQUES

L'API applique automatiquement :

```javascript
transformation: [
  { width: 1200, height: 1200, crop: 'limit' },  // Max 1200x1200
  { quality: 'auto' },                            // Qualité optimale
  { fetch_format: 'auto' },                       // Format optimal (WebP si supporté)
]
```

**Résultat** :
- Images redimensionnées si trop grandes
- Poids optimisé (souvent -70%)
- Format moderne (WebP pour navigateurs récents)
- Chargement ultra-rapide via CDN

---

## 🔒 SÉCURITÉ

### ✅ Ce qui est implémenté :

- Authentification requise pour upload
- Validation type de fichier (JPG, PNG, WebP uniquement)
- Limite de taille : 5MB maximum
- Dossier dédié par type (`products/`, `users/`)
- API Secret jamais exposé côté client

### 🔜 Améliorations futures :

- [ ] Watermark automatique (logo Ecomm-Burkina)
- [ ] Détection de contenu inapproprié
- [ ] Limitation du nombre d'uploads par utilisateur
- [ ] Compression avancée

---

## 💰 PLAN GRATUIT - LIMITES

Le plan gratuit Cloudinary offre :

| Ressource | Limite |
|-----------|--------|
| Stockage | 25 GB |
| Bande passante | 25 GB/mois |
| Transformations | 25,000/mois |
| Vidéos | 25 crédits/mois |

**Pour Ecomm-Burkina** :
- ~2,500 images produits (si 10MB/image en moyenne)
- ~250,000 vues/mois (si 100KB/image après compression)
- Largement suffisant pour démarrer !

### Si dépassement :

1. **Upgrade vers plan payant** ($89/mois)
2. **Optimiser** : Supprimer anciennes images
3. **Alternative** : Amazon S3 (moins cher mais plus technique)

---

## 🐛 RÉSOLUTION DE PROBLÈMES

### Erreur : "Invalid API credentials"

**Solution** :
- Vérifier que les 3 variables sont dans `.env`
- Vérifier qu'il n'y a pas d'espaces avant/après les valeurs
- Redémarrer le serveur

### Erreur : "File too large"

**Solution** :
- Limite actuelle : 5MB
- Compresser l'image avant upload
- Ou augmenter la limite dans `/api/upload/route.ts` :

```typescript
if (file.size > 10 * 1024 * 1024) { // 10MB
```

### Upload lent

**Causes possibles** :
- Connexion internet lente
- Image très lourde (>3MB)
- Serveur Cloudinary occupé

**Solutions** :
- Compresser l'image
- Essayer à nouveau
- Vérifier le réseau

### Image ne s'affiche pas

**Vérifications** :
1. L'URL Cloudinary est-elle valide ?
2. L'image est-elle dans Media Library ?
3. Le CORS est-il configuré ? (normalement auto)
4. Vider le cache du navigateur

---

## 🎯 BONNES PRATIQUES

### 1. Nommage des images

```
❌ Mauvais : IMG_1234.jpg
✅ Bon : iphone-15-pro-max-black.jpg
```

### 2. Format optimal

- **JPG** : Photos avec dégradés
- **PNG** : Logos, transparence
- **WebP** : Meilleur compromis (auto)

### 3. Taille recommandée

- **Produits** : 1200x1200px (carré)
- **Bannières** : 1920x600px
- **Logos** : 400x400px

### 4. Compression avant upload

Outils recommandés :
- https://tinypng.com
- https://squoosh.app
- Photoshop "Save for Web"

### 5. Supprimer les images inutilisées

Avant de supprimer un produit :
1. Noter le `publicId` de l'image
2. Supprimer via API : `DELETE /api/upload`
3. Ou manuellement dans Cloudinary

---

## 📊 MONITORING

### Vérifier l'usage

1. Dashboard Cloudinary
2. **Reports** → **Usage**
3. Voir : Stockage, Bande passante, Transformations

### Alertes

Configurer des alertes email quand :
- Stockage > 80%
- Bande passante > 80%
- Crédits vidéo épuisés

---

## 🔄 MIGRATION (si changement de service)

Si vous voulez changer de Cloudinary vers S3 :

1. Exporter toutes les URLs des images depuis la DB
2. Download toutes les images
3. Upload vers S3
4. Update les URLs dans la DB
5. Script de migration disponible sur demande

---

## 📞 SUPPORT CLOUDINARY

- Documentation : https://cloudinary.com/documentation
- Support : support@cloudinary.com
- Community : https://community.cloudinary.com

---

## ✅ CHECKLIST FINALE

Avant de mettre en production :

- [ ] Compte Cloudinary créé
- [ ] Variables `.env` configurées
- [ ] Test upload réussi
- [ ] Images visibles sur le site
- [ ] Images dans Media Library Cloudinary
- [ ] Plan gratuit suffisant pour le trafic prévu
- [ ] Backup des images important (export régulier)

---

**Configuration terminée ! 🎉**

Vous pouvez maintenant upload des images professionnelles pour vos produits !

**Questions ?** Consultez la documentation Cloudinary ou contactez August (sofirdaw@gmail.com)
