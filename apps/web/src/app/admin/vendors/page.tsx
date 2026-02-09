'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Package,
  Eye,
  Ban,
  CheckCircle,
  MoreHorizontal,
  Mail,
  Phone
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  commissionRate: number;
  isActive: boolean;
  approvedAt: string;
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  commission: number;
  createdAt: string;
  lastLoginAt: string;
}

export default function AdminVendorsPage() {
  const { data: session, status } = useSession();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-32 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/auth/login?callbackUrl=/admin/vendors');
  }

  const isAdmin = (session.user as any)?.role === 'ADMIN';
  if (!isAdmin) {
    redirect('/');
  }

  useEffect(() => {
    fetchVendors();
  }, [statusFilter]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/admin/vendors?${params}`);
      if (response.ok) {
        const data = await response.json();
        setVendors(data);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = vendors.reduce((sum, vendor) => sum + vendor.totalRevenue, 0);
  const totalCommission = vendors.reduce((sum, vendor) => sum + vendor.commission, 0);
  const activeVendors = vendors.filter(vendor => vendor.isActive).length;

  const handleToggleVendorStatus = async (vendorId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        setVendors(vendors.map(vendor => 
          vendor.id === vendorId ? { ...vendor, isActive: !isActive } : vendor
        ));
      } else {
        alert('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Error updating vendor status:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Revendeurs</h1>
          <p className="text-muted-foreground">
            Gérez les revendeurs et suivez leurs performances
          </p>
        </div>
        <Button asChild>
          <a href="/admin/vendors/applications">
            <Users className="mr-2 h-4 w-4" />
            Demandes en attente
          </a>
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Revendeurs actifs</p>
                <p className="text-2xl font-bold">{activeVendors} / {vendors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Revenus totaux</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF'
                  }).format(totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Commission totale</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF'
                  }).format(totalCommission)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un revendeur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
          >
            Tous
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('active')}
          >
            Actifs
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('inactive')}
          >
            Inactifs
          </Button>
        </div>
      </div>

      {/* Liste des revendeurs */}
      <div className="space-y-4">
        {vendors.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun revendeur trouvé</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Aucun revendeur ne correspond à votre recherche.'
                  : 'Aucun revendeur inscrit pour le moment.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          vendors.map((vendor) => (
            <Card key={vendor.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{vendor.name}</h3>
                      <p className="text-sm text-muted-foreground">{vendor.businessName}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {vendor.email}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {vendor.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={vendor.isActive ? 'default' : 'secondary'}>
                        {vendor.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Badge variant="outline">
                        {vendor.commissionRate * 100}% commission
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{vendor.totalProducts}</span> produits
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">{vendor.totalSales}</span> ventes
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XOF'
                        }).format(vendor.totalRevenue)}
                      </p>
                      <p className="text-xs text-purple-600">
                        Commission: {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XOF'
                        }).format(vendor.commission)}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a href={`/admin/vendors/${vendor.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir détails
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleToggleVendorStatus(vendor.id, vendor.isActive)}
                      >
                        {vendor.isActive ? (
                          <>
                            <Ban className="mr-2 h-4 w-4" />
                            Désactiver
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activer
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
