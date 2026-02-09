'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Shield, Users, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  hasVendorAccess: boolean;
  createdAt: Date;
}

export default function VendorAccessPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/vendor-access');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVendorAccess = async (userId: string, currentAccess: boolean) => {
    try {
      setUpdating(userId);
      const response = await fetch('/api/admin/vendor-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          hasVendorAccess: !currentAccess,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Mettre à jour l'état local
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId
              ? { ...user, hasVendorAccess: !currentAccess }
              : user
          )
        );
        alert('Accès vendeur mis à jour avec succès!');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de l\'accès vendeur');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Gestion des Accès Vendeurs
        </h1>
        <p className="text-muted-foreground">
          Gérez les permissions d'accès au panel vendeur pour les utilisateurs
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total utilisateurs</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Accès vendeur</p>
                <p className="text-2xl font-bold">{users.filter(u => u.hasVendorAccess).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Sans accès</p>
                <p className="text-2xl font-bold">{users.filter(u => !u.hasVendorAccess).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            Activez ou désactivez l'accès vendeur pour chaque utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.name}</p>
                      <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {user.hasVendorAccess ? 'Accès autorisé' : 'Accès refusé'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Panel vendeur
                    </p>
                  </div>
                  <Switch
                    checked={user.hasVendorAccess}
                    onCheckedChange={() => toggleVendorAccess(user.id, user.hasVendorAccess)}
                    disabled={updating === user.id}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Activez l'accès vendeur pour permettre aux utilisateurs de gérer leur boutique</p>
            <p>• Les utilisateurs avec accès vendeur verront "Panel Vendeur" dans leur menu</p>
            <p>• Désactivez l'accès pour révoquer les permissions vendeur</p>
            <p>• Les administrateurs ont toujours accès à toutes les fonctionnalités</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
