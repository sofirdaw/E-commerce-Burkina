import { prisma } from '@ecomm-burkina/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

async function getOrders() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      shippingAddress: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    take: 100,
  });

  return orders;
}

const statusColors = {
  PENDING: 'secondary',
  PROCESSING: 'warning',
  SHIPPED: 'default',
  DELIVERED: 'success',
  CANCELLED: 'destructive',
  REFUNDED: 'destructive',
} as const;

const statusLabels = {
  PENDING: 'En attente',
  PROCESSING: 'En traitement',
  SHIPPED: 'Expédié',
  DELIVERED: 'Livré',
  CANCELLED: 'Annulé',
  REFUNDED: 'Remboursé',
};

const paymentStatusLabels = {
  PENDING: 'En attente',
  COMPLETED: 'Payé',
  FAILED: 'Échoué',
  REFUNDED: 'Remboursé',
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    processing: orders.filter((o) => o.status === 'PROCESSING').length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Commandes</h1>
        <p className="text-muted-foreground">
          Gérez toutes les commandes clients
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Commandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En traitement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.processing}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Livrées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.delivered}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left">Numéro</th>
                  <th className="pb-3 text-left">Client</th>
                  <th className="pb-3 text-left">Date</th>
                  <th className="pb-3 text-right">Montant</th>
                  <th className="pb-3 text-center">Paiement</th>
                  <th className="pb-3 text-center">Statut</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-4">
                      <p className="font-mono font-medium">
                        {order.orderNumber}
                      </p>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium">
                          {order.shippingAddress.fullName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.shippingAddress.phone}
                        </p>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-sm">
                        {formatDate(order.createdAt)}
                      </p>
                    </td>
                    <td className="py-4 text-right font-medium">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-4 text-center">
                      <Badge
                        variant={
                          order.paymentStatus === 'COMPLETED'
                            ? 'success'
                            : order.paymentStatus === 'FAILED'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {paymentStatusLabels[order.paymentStatus]}
                      </Badge>
                    </td>
                    <td className="py-4 text-center">
                      <Badge variant={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                Aucune commande trouvée
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
