import { prisma } from '@ecomm-burkina/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

async function getStats() {
  const [
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue,
    totalStockValue,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.product.aggregate({
      _sum: {
        price: true,
      },
      where: {
        isActive: true,
        stock: { gt: 0 },
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        shippingAddress: true,
      },
    }),
  ]);

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    totalStockValue: totalStockValue._sum.price || 0,
    recentOrders,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      title: 'Valeur du Stock',
      value: formatCurrency(stats.totalStockValue),
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Revenus Total',
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      trend: '+8.2%',
      trendUp: true,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Produits',
      value: stats.totalProducts.toString(),
      icon: Package,
      trend: '+3',
      trendUp: true,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Utilisateurs',
      value: stats.totalUsers.toString(),
      icon: Users,
      trend: '+24',
      trendUp: true,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Bienvenue dans votre espace d'administration
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="mt-1 flex items-center text-xs">
                  <TrendIcon
                    className={`mr-1 h-3 w-3 ${
                      stat.trendUp ? 'text-green-600' : 'text-red-600'
                    }`}
                  />
                  <span
                    className={
                      stat.trendUp ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {stat.trend}
                  </span>
                  <span className="ml-1 text-muted-foreground">
                    ce mois
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Aucune commande récente
            </p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingAddress.fullName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              Ajouter un produit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Créer un nouveau produit dans le catalogue
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-500" />
              Gérer les commandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Voir et traiter les commandes en attente
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Gérer les utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Administrer les comptes utilisateurs
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
