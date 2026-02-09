import { prisma } from '@ecomm-burkina/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { UserCog, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      orders: {
        select: {
          id: true,
          totalAmount: true,
        },
      },
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  return users;
}

const roleColors = {
  ADMIN: 'destructive',
  VENDOR: 'default',
  USER: 'secondary',
} as const;

const roleLabels = {
  ADMIN: 'Administrateur',
  VENDOR: 'Vendeur',
  USER: 'Client',
};

export default async function AdminUsersPage() {
  const users = await getUsers();

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'ADMIN').length,
    vendors: users.filter((u) => u.role === 'VENDOR').length,
    users: users.filter((u) => u.role === 'USER').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Utilisateurs</h1>
        <p className="text-muted-foreground">
          Gérez tous les utilisateurs de la plateforme
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Administrateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.admins}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vendeurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.vendors}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.users}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => {
          const totalSpent = user.orders.reduce(
            (sum, order) => sum + order.totalAmount,
            0
          );

          return (
            <Card key={user.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name || 'User'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-lg font-semibold text-muted-foreground">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name || 'Sans nom'}</p>
                      <Badge variant={roleColors[user.role]} className="mt-1">
                        {roleLabels[user.role]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{user.email}</span>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Inscrit le {formatDate(user.createdAt)}</span>
                </div>

                {user._count.orders > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {user._count.orders} commande
                      {user._count.orders > 1 ? 's' : ''}
                      {totalSpent > 0 && (
                        <span className="ml-1 font-semibold text-orange-600">
                          ({new Intl.NumberFormat('fr-BF', {
                            style: 'currency',
                            currency: 'XOF',
                            minimumFractionDigits: 0,
                          }).format(totalSpent)})
                        </span>
                      )}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <UserCog className="mr-2 h-4 w-4" />
                    Gérer
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Aucun utilisateur trouvé
          </CardContent>
        </Card>
      )}
    </div>
  );
}
