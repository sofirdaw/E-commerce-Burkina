'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Package,
  Eye,
  MousePointer,
  Calendar,
  Loader2
} from 'lucide-react';

interface AnalyticsData {
  visitors: {
    total: number;
    unique: number;
    returning: number;
    growth: number;
  };
  sales: {
    total: number;
    revenue: number;
    averageOrderValue: number;
    growth: number;
  };
  products: {
    total: number;
    active: number;
    outOfStock: number;
    topSelling: Array<{
      name: string;
      sales: number;
      revenue: number;
    }>;
  };
  traffic: {
    direct: number;
    search: number;
    social: number;
    referral: number;
  };
  pages: {
    mostViewed: Array<{
      path: string;
      views: number;
    }>;
    bounceRate: number;
    avgSessionDuration: number;
  };
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Statistiques et analyses de votre boutique
        </p>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Période
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <Button
                key={range}
                variant={dateRange === range ? 'default' : 'outline'}
                onClick={() => setDateRange(range)}
              >
                {range === '7d' && '7 jours'}
                {range === '30d' && '30 jours'}
                {range === '90d' && '3 mois'}
                {range === '1y' && '1 an'}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visiteurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.visitors.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.visitors.unique} uniques • {data.visitors.returning} retour
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+{data.visitors.growth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.sales.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.sales.revenue.toLocaleString('fr-BF', { style: 'currency', currency: 'XOF' })} revenus
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+{data.sales.growth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Panier moyen</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.sales.averageOrderValue.toLocaleString('fr-BF', { style: 'currency', currency: 'XOF' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Par commande
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.products.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.products.active} actifs • {data.products.outOfStock} en rupture
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              Sources de trafic
            </CardTitle>
            <CardDescription>
              D'où viennent vos visiteurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Accès direct</span>
                <span className="text-sm">{data.traffic.direct}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${data.traffic.direct}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Moteurs de recherche</span>
                <span className="text-sm">{data.traffic.search}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${data.traffic.search}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Réseaux sociaux</span>
                <span className="text-sm">{data.traffic.social}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${data.traffic.social}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Références</span>
                <span className="text-sm">{data.traffic.referral}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${data.traffic.referral}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produits les plus vendus
            </CardTitle>
            <CardDescription>
              Les meilleurs produits de la période
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.products.topSelling.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.sales} ventes • {product.revenue.toLocaleString('fr-BF', { style: 'currency', currency: 'XOF' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{product.sales}</p>
                    <p className="text-xs text-muted-foreground">ventes</p>
                  </div>
                </div>
              ))}
              {data.products.topSelling.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune vente enregistrée
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Analyse des pages
          </CardTitle>
          <CardDescription>
            Performances des pages de votre site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium mb-4">Pages les plus vues</h4>
              <div className="space-y-3">
                {data.pages.mostViewed.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{page.path}</span>
                    <span className="text-sm font-medium">{page.views} vues</span>
                  </div>
                ))}
                {data.pages.mostViewed.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Aucune donnée de vue disponible
                  </p>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4">Métriques d'engagement</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Taux de rebond</span>
                  <span className="text-sm font-medium">{data.pages.bounceRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Durée moyenne</span>
                  <span className="text-sm font-medium">{data.pages.avgSessionDuration}s</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
