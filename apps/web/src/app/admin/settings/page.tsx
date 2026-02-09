'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Store, 
  CreditCard, 
  Smartphone, 
  Mail, 
  Bell, 
  Shield, 
  Download, 
  AlertTriangle, 
  Truck, 
  Save, 
  RefreshCw, 
  Loader2, 
  Database, 
  HardDrive
} from 'lucide-react';

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeDescription: string;
  freeShippingThreshold: number;
  standardShippingCost: number;
  expressShippingAvailable: boolean;
  expressShippingCost: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  maintenanceMode: boolean;
}

interface Backup {
  name: string;
  path: string;
  size: number;
  created: string;
  type: 'database' | 'data' | 'complete';
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'Ecomm Burkina',
    storeEmail: 'contact@ecomm-burkina.bf',
    storePhone: '+226 00 00 00 00',
    storeAddress: 'Ouagadougou, Burkina Faso',
    storeDescription: 'Votre boutique de confiance au Burkina Faso',
    freeShippingThreshold: 50000,
    standardShippingCost: 2000,
    expressShippingAvailable: true,
    expressShippingCost: 5000,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleteBackingUp, setIsCompleteBackingUp] = useState(false);
  const [showBackups, setShowBackups] = useState(false);
  const [backups, setBackups] = useState<Backup[]>([]);

  useEffect(() => {
    fetchSettings();
    fetchBackups();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setSettings(data);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      alert('Erreur lors du chargement des paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBackups = async () => {
    try {
      const response = await fetch('/api/admin/backup');
      if (response.ok) {
        const data = await response.json();
        setBackups(data.backups || []);
      }
    } catch (error) {
      console.error('Error fetching backups:', error);
    }
  };

  const handleCompleteBackup = async () => {
    const confirmed = window.confirm(
      `🔄 SAUVEGARDE COMPLÈTE DU SITE\n\n` +
      `Cette action va créer une sauvegarde complète contenant:\n\n` +
      `📁 Code source complet (apps/, packages/)\n` +
      `📁 Fichiers publics (public/)\n` +
      `📊 Base de données complète\n` +
      `⚙️ Settings et analytics\n` +
      `📄 Fichiers de configuration\n\n` +
      `Où souhaitez-vous sauvegarder?\n\n` +
      `📍 LOCAL: Dans le dossier backups/ du projet\n` +
      `📍 EXTERNE: Sur disque dur externe (recommandé)\n\n` +
      `Cliquez sur OK pour EXTERNE ou ANNULER pour LOCAL`
    );

    const backupLocation = confirmed ? 'external' : 'local';

    if (backupLocation === 'external') {
      const externalConfirmed = window.confirm(
        `💾 SAUVEGARDE SUR DISQUE EXTERNE\n\n` +
        `Le système va:\n` +
        `✅ Détecter automatiquement le disque externe\n` +
        `✅ Créer un dossier EcommBurkina-Backups\n` +
        `✅ Sauvegarder tout le site\n\n` +
        `Assurez-vous que votre disque dur externe est connecté!\n\n` +
        `Continuer?`
      );
      
      if (!externalConfirmed) return;
    }

    setIsCompleteBackingUp(true);
    
    try {
      const response = await fetch('/api/admin/backup/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ backupLocation }),
      });

      const result = await response.json();

      if (result.success) {
        const location = backupLocation === 'external' ? 'disque dur externe' : 'stockage local';
        alert(
          `✅ SAUVEGARDE COMPLÈTE RÉUSSIE!\n\n` +
          `📍 Destination: ${location}\n` +
          `📦 Fichier: ${result.file}\n` +
          `📏 Taille: ${result.sizeInMB} MB\n` +
          `📅 Date: ${new Date(result.timestamp).toLocaleString('fr-FR')}\n\n` +
          `🔄 Format: ${result.format}\n\n` +
          `Contenu inclus:\n${result.includes.join('\n')}\n\n` +
          `${result.note}\n\n` +
          `💡 Le backup est prêt pour restauration complète!`
        );
        await fetchBackups();
      } else {
        alert(`❌ Erreur lors de la sauvegarde: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde complète:', error);
      alert('❌ Erreur lors de la sauvegarde complète. Veuillez réessayer.');
    } finally {
      setIsCompleteBackingUp(false);
    }
  };

  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        alert('Sauvegarde créée avec succès!');
        await fetchBackups(); // Refresh backups list
      } else {
        alert('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleDownload = async (backup: Backup) => {
    try {
      // Create download link
      const response = await fetch(`/api/admin/backup/download?file=${encodeURIComponent(backup.path)}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = backup.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Erreur lors du téléchargement');
      }
    } catch (error) {
      console.error('Error downloading backup:', error);
      alert('Erreur lors du téléchargement');
    }
  };

  const handleRestore = async (backup: Backup) => {
    const confirmMessage = backup.type === 'complete'
      ? `🔄 RESTAURATION COMPLÈTE DU SITE 🔄\n\n` +
        `Vous êtes sur le point de restaurer: ${backup.name}\n\n` +
        `🔴 ATTENTION: Cette action va:\n` +
        `• SUPPRIMER TOUT le code source actuel\n` +
        `• SUPPRIMER TOUTES les données actuelles\n` +
        `• REMETTRE le site à l'état de la sauvegarde\n` +
        `• INCLURE admin ET client panels\n\n` +
        `🚨 CECI EST UNE RESTAURATION COMPLÈTE!\n\n` +
        `Cette action est TOTALEMENT IRRÉVERSIBLE!\n\n` +
        `Êtes-vous ABSOLUMENT certain de vouloir continuer?`
      : backup.type === 'database' 
      ? `⚠️ RESTAURATION COMPLÈTE DE LA BASE DE DONNÉES ⚠️\n\n` +
        `Vous êtes sur le point de restaurer: ${backup.name}\n\n` +
        `🔴 ATTENTION: Cette action va:\n` +
        `• SUPPRIMER TOUTES les données actuelles\n` +
        `• Restaurer les utilisateurs, produits, commandes, etc.\n` +
        `• Réinitialiser la base à l'état de la sauvegarde\n\n` +
        `Cette action est IRRÉVERSIBLE!\n\n` +
        `Êtes-vous ABSOLUMENT certain de vouloir continuer?`
      : `Restaurer les données du fichier: ${backup.name}?\n\n` +
        `Cela remplacera les settings et analytics actuels.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setIsRestoring(true);
      
      // Choose the right restore endpoint
      const restoreEndpoint = backup.type === 'complete' 
        ? '/api/admin/restore/complete'
        : '/api/admin/restore';
      
      const response = await fetch(restoreEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          backupFile: backup.path,
          type: backup.type === 'complete' ? 'complete' : backup.type
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}`);
        
        if (backup.type === 'complete') {
          // Show detailed success message for complete restore
          alert(`🎉 RESTAURATION COMPLÈTE RÉUSSIE!\n\n` +
            `Le site a été complètement restauré:\n${data.restored.join('\n')}\n\n` +
            `Prochaines étapes:\n${data.nextSteps.join('\n')}\n\n` +
            `La page va s'actualiser dans 5 secondes...`);
          
          // Reload page after complete restore
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        } else if (backup.type === 'database') {
          // Show detailed success message for database restore
          alert(`🎉 RESTAURATION RÉUSSIE!\n\n` +
            `La base de données a été complètement restaurée.\n` +
            `Toutes les données (utilisateurs, produits, commandes, etc.)\n` +
            `sont maintenant comme dans la sauvegarde.\n\n` +
            `La page va s'actualiser...`);
          
          // Reload page after database restore
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          // Refresh settings after data restore
          await fetchSettings();
        }
      } else {
        const errorData = await response.json();
        alert(`❌ Erreur lors de la restauration:\n${errorData.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      alert('❌ Erreur lors de la restauration');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDeleteBackup = async (backup: Backup) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${backup.name}?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch('/api/admin/restore', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          backupFile: backup.path
        }),
      });

      if (response.ok) {
        alert('Sauvegarde supprimée avec succès');
        await fetchBackups(); // Refresh backups list
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting backup:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('Paramètres sauvegardés avec succès');
      } else {
        alert('Erreur lors de la sauvegarde des paramètres');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/admin/settings/reset', {
        method: 'POST',
      });

      if (response.ok) {
        await fetchSettings();
        alert('Paramètres réinitialisés avec succès');
      } else {
        alert('Erreur lors de la réinitialisation des paramètres');
      }
    } catch (error) {
      console.error('Error resetting settings:', error);
      alert('Erreur lors de la réinitialisation des paramètres');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Paramètres
        </h1>
        <p className="text-muted-foreground">
          Configurez les paramètres de votre boutique
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Informations de la boutique
              </CardTitle>
              <CardDescription>
                Informations générales sur votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nom de la boutique</Label>
                  <Input 
                    id="storeName" 
                    value={settings.storeName}
                    onChange={(e) => setSettings(prev => ({ ...prev, storeName: e.target.value }))}
                    placeholder="Nom de votre boutique"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email de contact</Label>
                  <Input 
                    id="storeEmail" 
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, storeEmail: e.target.value }))}
                    placeholder="contact@votre-boutique.com"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Téléphone</Label>
                  <Input 
                    id="storePhone" 
                    value={settings.storePhone}
                    onChange={(e) => setSettings(prev => ({ ...prev, storePhone: e.target.value }))}
                    placeholder="+226 XX XX XX XX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Adresse</Label>
                  <Input 
                    id="storeAddress" 
                    value={settings.storeAddress}
                    onChange={(e) => setSettings(prev => ({ ...prev, storeAddress: e.target.value }))}
                    placeholder="Votre adresse"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeDescription">Description</Label>
                <textarea
                  id="storeDescription"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={settings.storeDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, storeDescription: e.target.value }))}
                  placeholder="Description de votre boutique"
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Livraison
              </CardTitle>
              <CardDescription>
                Configurez les options de livraison
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Livraison gratuite à partir de (FCFA)</Label>
                  <Input 
                    id="freeShippingThreshold" 
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => setSettings(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="standardShippingCost">Frais de livraison standard (FCFA)</Label>
                  <Input 
                    id="standardShippingCost" 
                    type="number"
                    value={settings.standardShippingCost}
                    onChange={(e) => setSettings(prev => ({ ...prev, standardShippingCost: Number(e.target.value) }))}
                    placeholder="2000"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Livraison express disponible</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer la livraison express
                    </p>
                  </div>
                  <Switch 
                    checked={settings.expressShippingAvailable}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, expressShippingAvailable: checked }))}
                  />
                </div>

                {settings.expressShippingAvailable && (
                  <div className="space-y-2">
                    <Label htmlFor="expressShippingCost">Frais de livraison express (FCFA)</Label>
                    <Input 
                      id="expressShippingCost" 
                      type="number"
                      value={settings.expressShippingCost}
                      onChange={(e) => setSettings(prev => ({ ...prev, expressShippingCost: Number(e.target.value) }))}
                      placeholder="5000"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configurez les notifications système
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir les notifications par email
                  </p>
                </div>
                <Switch 
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir les notifications par SMS
                  </p>
                </div>
                <Switch 
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde en cours...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder les paramètres
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleReset}
              disabled={isSaving}
            >
              Réinitialiser par défaut
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                État du système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Mode maintenance</span>
                <Switch 
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Base de données</span>
                <Badge variant="default" className="bg-green-500">
                  Connectée
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API</span>
                <Badge variant="default" className="bg-green-500">
                  Opérationnelle
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="mr-2 h-4 w-4" />
                Vider le cache
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleBackup}
                disabled={isBackingUp}
              >
                {isBackingUp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde BDD en cours...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Sauvegarder la base
                  </>
                )}
              </Button>
              <Button
                onClick={handleCompleteBackup}
                disabled={isCompleteBackingUp}
                className="w-full"
              >
                {isCompleteBackingUp ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde en cours...
                  </>
                ) : (
                  <>
                    <HardDrive className="mr-2 h-4 w-4" />
                    Sauvegarde COMPLÈTE (Local/Externe)
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowBackups(true)}
              >
                <Shield className="mr-2 h-4 w-4" />
                Gérer les sauvegardes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Backups Modal */}
      {showBackups && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4">
            <CardHeader>
              <CardTitle>Sauvegardes disponibles</CardTitle>
              <CardDescription>
                Gérez vos sauvegardes de base de données et de fichiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {backups.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucune sauvegarde disponible</p>
                  <Button onClick={handleBackup} className="mt-4">
                    Créer une sauvegarde
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {backups.map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={backup.type === 'complete' ? 'destructive' : backup.type === 'database' ? 'default' : 'secondary'}>
                            {backup.type === 'complete' ? '🔄 COMPLET' : backup.type === 'database' ? 'Base de données' : 'Fichiers'}
                          </Badge>
                          <span className="font-medium">{backup.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Créée le {new Date(backup.created).toLocaleString('fr-BF')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Taille: {(backup.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(backup)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(backup)}
                          disabled={isRestoring}
                        >
                          {isRestoring ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Database className="h-4 w-4 mr-1" />
                              Restaurer
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteBackup(backup)}
                          disabled={isDeleting}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setShowBackups(false)}>
                Fermer
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
