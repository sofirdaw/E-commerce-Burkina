# 🧪 Guide de Test - Système d'Étoiles et Like

## 📋 Avant de Commencer

### Prérequis
- [ ] Application en cours d'exécution (`pnpm run dev`)
- [ ] Session utilisateur active (connexion)
- [ ] Console développeur ouverte (F12)
- [ ] Au moins un produit disponible

### Environnement
```bash
# Terminal 1 - Démarrer l'app
cd apps/web
pnpm run dev

# Terminal 2 - Vérifier les logs API
# Garder un oeil sur la console
```

---

## ✅ Tests Manuels

### 1️⃣ TEST: Affichage des Étoiles

#### Étapes
1. Naviguer vers `/products` (Page des produits)
2. Observer les cartes produit
3. Vérifier que les étoiles sont affichées
4. Vérifier le nombre de révisions (ex: "4.5 (23)")

#### Points de Vérification
- [ ] Les étoiles s'affichent correctement
- [ ] La couleur est jaune pour les étoiles remplies
- [ ] La couleur est grise pour les étoiles vides
- [ ] Le nombre de révisions s'affiche

#### Expected Result
```
⭐⭐⭐⭐☆ (4.0 / 42)
```

---

### 2️⃣ TEST: Cliquer sur les Étoiles (Non-authentifié)

#### Étapes
1. Sur la page `/products`, se déconnecter (si authentifié)
2. Essayer de cliquer sur une étoile
3. Observer le message

#### Expected Result
```
Toast: "Veuillez vous connecter pour noter ce produit"
Type: info (bleu)
```

#### Vérifier
- [ ] Le toast s'affiche
- [ ] Le toast slide-in depuis la droite
- [ ] Le message est clair
- [ ] Après 3s, le toast disparaît

---

### 3️⃣ TEST: Noter un Produit (Authentifié)

#### Étapes
1. Être authentifié
2. Aller sur `/products/[slug]` (Détail du produit)
3. Finder la section "Rating Stars"
4. Cliquer sur la 4e étoile

#### Expected Result
```
- Les étoiles 1-4 deviennent jaunes
- Les étoiles 5 restent grises
- Animation de scale (grossir) sur la 4e étoile
- Toast: "Note de 4 étoiles enregistrée ⭐"
- Message: "✓ Votre note: 4 étoiles"
```

#### Vérifier en Console
```javascript
// Check the API call
// Network tab → POST /api/reviews/rate
// Payload should have: { productId: "...", rating: 4 }
// Response should have: { success: true, averageRating: 4.x }
```

#### Vérifier en DB
```sql
SELECT * FROM reviews 
WHERE userId = 'current-user' 
AND productId = 'product-id';
```

---

### 4️⃣ TEST: Mettre à Jour la Note

#### Étapes
1. Même produit, déjà noté avec 4 étoiles
2. Cliquer sur la 5e étoile
3. Observer le changement

#### Expected Result
```
- Toutes les étoiles deviennent jaunes (1-5)
- Toast: "Note de 5 étoiles enregistrée ⭐"
- Message: "✓ Votre note: 5 étoiles"
- La moyenne du produit se met à jour
```

#### Vérifier en DB
```sql
UPDATE reviews SET updated_at = NOW() 
WHERE userId = 'current-user';
```

---

### 5️⃣ TEST: Animation Rebond (Like Button)

#### Étapes
1. Aller sur `/products/[slug]`
2. Trouver le bouton like (❤️ en haut à droite de ProductCard)
3. Cliquer dessus

#### Expected Result: Animation
```
Temps: 0ms     → Utilisateur clique
        50ms    → Cœur grossit (scale: 1 → 1.3)
        300ms   → Cœur revient à la normale (scale: 1.3 → 1)
        600ms   → Animation finie
```

#### Vérifier Visuellement
- [ ] Le cœur remonte et descend
- [ ] Le mouvement est fluide (pas saccadé)
- [ ] Pas de scintillement
- [ ] Duré environ 600ms

#### CSS Inspection
```javascript
// F12 → Elements → Inspecter le cœur
// Chercher: class="animate-bounce-heart"
// Animation devrait être: bounce-heart 0.6s cubic-bezier(...)
```

---

### 6️⃣ TEST: Toast "Ajouté aux Favoris"

#### Étapes
1. Cliquer sur le bouton ❤️ pour aimer un produit
2. Observer le toast

#### Expected Result
```
┌──────────────────────────────┐
│ ✓ Produit ajouté aux favoris ❤️│ ← Toast slide-in
└──────────────────────────────┘

Disparaît après 3 secondes
OU peut être fermé manuellement
```

#### Vérifier
- [ ] Toast appear en bas-droit
- [ ] Animation slide-in fluide (300ms)
- [ ] Couleur verte (#10b981)
- [ ] Icône X pour fermer manuellement
- [ ] Auto-fermeture après 3s

---

### 7️⃣ TEST: Retirer des Favoris

#### Étapes
1. Aimer un produit (cœur est rouge)
2. Cliquer de nouveau sur le cœur pour retirer

#### Expected Result
```
Toast: "Produit retiré des favoris"
Cœur redevient gris
Animation rebond se joue
```

#### Vérifier
- [ ] Le toast s'affiche
- [ ] Le message est différent du "ajouté"
- [ ] Le cœur change de couleur
- [ ] L'animation rebond se joue

---

### 8️⃣ TEST: Favoris Persistant

#### Étapes
1. Aimer un produit
2. Rafraîchir la page (F5)
3. Observer l'état du cœur

#### Expected Result
```
Après refresh:
- Le cœur est toujours rouge
- La sauvegarde en DB est correcte
```

#### Vérifier en Console
```javascript
// Network → GET /api/likes/check?productId=...
// Response devrait: { isLiked: true }
```

---

### 9️⃣ TEST: Toast avec Erreur

#### Étapes
1. Ouvrir DevTools (F12)
2. Network tab → Throttle to "Offline"
3. Essayer d'aimer un produit
4. Observer le message d'erreur

#### Expected Result
```
Toast Rouge: "Erreur lors de la mise à jour des favoris"
Cœur revient à l'état précédent (revert)
```

#### Vérifier
- [ ] Toast d'erreur en rouge (#dc2626)
- [ ] Message d'erreur clair
- [ ] État revient en arrière
- [ ] Pas de crash de l'app

---

### 🔟 TEST: Page Produit - Section Rating

#### Étapes
1. Aller sur `/products/[slug]`
2. Scroller jusqu'à la section "Détails du produit"
3. Observer la section Rating

#### Expected Result
```
┌────────────────────────────────┐
│ Étoiles Interactives:          │
│ ⭐⭐⭐⭐☆ (4.2 / 58 avis)      │
│                                │
│ [Cliquez pour noter...]        │
│                                │
│ ✓ Votre note: 5 étoiles        │
└────────────────────────────────┘
```

#### Interactions
- [ ] Hover sur chaque étoile → Toutes les étoiles jusqu'à celle-ci deviennent jaunes
- [ ] Click → Note enregistrée
- [ ] Message de confirmation
- [ ] Affichage de la note personnelle

---

### 1️⃣1️⃣ TEST: Responsive - Mobile

#### Configuration
1. DevTools → Toggle device toolbar (Ctrl+Shift+M)
2. Réduire à iPhone 12 (390x844)
3. Naviguer vers un produit

#### Vérification
- [ ] Les étoiles sont cliquables sur mobile
- [ ] Le bouton like est accessible
- [ ] Le toast s'affiche correctement
- [ ] Pas de débordement de texte

---

### 1️⃣2️⃣ TEST: Accessibility - Keyboard Navigation

#### Étapes
1. Utiliser Tab pour naviguer
2. Appuyer sur Enter pour interagir

#### Expected Result
```
- Tab jusqu'au bouton like
- Enter → Like/Unlike
- Tab jusqu'aux étoiles
- Flèches gauche/droite → Changer de note
- Enter → Enregistrer
```

#### Focus Visible
- [ ] Outline visible autour des boutons
- [ ] Couleur du focus: orange (#f97316)

---

### 1️⃣3️⃣ TEST: Reduced Motion

#### Configuration
1. OS Settings → Accessibility → Reduce Motion → ON
2. Ou dans DevTools: Rendering → Emulate CSS media feature prefers-reduced-motion

#### Expected Result
```
- Pas d'animation
- Les éléments changent d'état instantanément
- Toast apparaît sans slide-in
```

#### Vérifier en CSS
```javascript
// F12 → Computed → Chercher les animations
// Ne devrait avoir AUCUNE animation active
```

---

## 🔍 Checklist de Test Complète

### Fonctionnalités
- [ ] Affichage des étoiles
- [ ] Notation (1-5)
- [ ] Mise à jour de note
- [ ] Affichage de la moyenne
- [ ] Like/Unlike
- [ ] Animation rebond
- [ ] Toast de confirmation
- [ ] Gestion d'erreurs
- [ ] Persistence (refresh)
- [ ] Authentification requise

### Animations
- [ ] Rebond du cœur (600ms)
- [ ] Slide-in du toast (300ms)
- [ ] Fade-in de la note
- [ ] Scale des étoiles au hover
- [ ] Transitions fluides

### Performance
- [ ] Pas de lag
- [ ] Pas de jank
- [ ] Optimistic updates
- [ ] API calls corrects
- [ ] DB updates corrects

### UX
- [ ] Messages clairs
- [ ] Feedback immédiat
- [ ] États visibles
- [ ] Erreurs gérées
- [ ] Responsive

### Accessibilité
- [ ] Clavier navigation
- [ ] Focus visible
- [ ] Reduced motion
- [ ] Contraste des couleurs
- [ ] Labels explicites

---

## 🐛 Dépannage Rapide

### Problème: Toast ne s'affiche pas
```
✓ Vérifier ToastProvider dans Providers
✓ Vérifier que useToast() est utilisé
✓ Vérifier que le composant est 'use client'
✓ Regarder Console pour les erreurs
```

### Problème: Étoiles ne sont pas cliquables
```
✓ Vérifier que interactive={true}
✓ Vérifier que l'utilisateur est authentifié
✓ Vérifier Console pour erreurs d'API
✓ Vérifier que le ProductId est correct
```

### Problème: Animation ne joue pas
```
✓ Vérifier les DevTools CSS animations
✓ Vérifier que la classe animate-* est appliquée
✓ Vérifier prefers-reduced-motion
✓ Vérifier que Tailwind CSS est bien chargé
```

### Problème: Rating ne s'enregistre pas
```
✓ Vérifier Network tab pour les erreurs API
✓ Vérifier la console pour les logs d'erreur
✓ Vérifier que l'authentification fonctionne
✓ Vérifier la base de données
```

---

## 📊 Résultats Attendus

### Performance
```
- API calls: < 200ms
- Animation: 60 FPS
- Toast duration: 3000ms
- No memory leaks
```

### Erreurs
```
- Aucune erreur TypeScript
- Aucune erreur console
- Aucune erreur API
- Aucun crash
```

### Données
```
- Notes correctes en DB
- Moyenne calculée correctement
- État utilisateur persistant
- Historique des changements
```

---

## 📝 Rapport de Test

Après chaque test, remplir:

```
Test: [Numéro et nom]
Date: [Date du test]
Tester: [Votre nom]

✓ PASS / ✗ FAIL

Détails:
[Description des résultats]

Erreurs:
[Lister les problèmes trouvés]

Recommandations:
[Suggestions d'amélioration]
```

---

## 🚀 Test en Production

Avant le déploiement:
- [ ] Tous les tests manuels passent
- [ ] Pas d'erreurs en console
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Accessibilité OK
- [ ] DB est à jour

---

**Guide créé:** 8 février 2026  
**Dernier update:** 8 février 2026  
**Status:** ✅ Prêt à tester
