'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Store, Mail, Phone, FileText, CheckCircle, ArrowLeft } from 'lucide-react';

export default function BecomeVendorPage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    description: '',
    contactEmail: session?.user?.email || '',
    contactPhone: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!session) {
    redirect('/auth/login?callbackUrl=/become-vendor');
  }

  // Vérifier si l'utilisateur a déjà accès vendeur
  const hasVendorAccess = (session.user as any)?.hasVendorAccess || false;

  if (hasVendorAccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-green-600">
            Accès Vendeur Déjà Activé
          </h1>
          <p className="mb-6 text-muted-foreground">
            Vous avez déjà accès au panel vendeur. Vous pouvez y accéder directement.
          </p>
          <div className="space-y-2">
            <Link href="/vendor-panel">
              <Button className="w-full">
                Accéder au panel vendeur
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/vendors/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: session?.user?.name?.split(' ')[0] || '',
          lastName: session?.user?.name?.split(' ').slice(1).join(' ') || '',
          email: session?.user?.email || '',
          phone: formData.contactPhone,
          businessName: formData.businessName,
          businessType: formData.businessType,
          description: formData.description,
          address: formData.address,
          city: '', // TODO: Add to form
          region: '', // TODO: Add to form
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert(result.error || 'Erreur lors de la soumission');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-green-600">
            Demande Envoyée!
          </h1>
          <p className="mb-6 text-muted-foreground">
            Votre demande pour devenir vendeur a été envoyée avec succès. Notre équipe va l'examiner et vous contactera sous 24-48h.
          </p>
          <div className="space-y-2">
            <Link href="/categories">
              <Button className="w-full">
                Explorer les produits en attendant
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="outline" className="w-full">
                Mon compte
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>
        <h1 className="mb-2 text-3xl font-bold">Devenir Vendeur</h1>
        <p className="text-muted-foreground">
          Rejoignez notre marketplace et commencez à vendre vos produits
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Formulaire */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations sur votre entreprise</CardTitle>
              <CardDescription>
                Remplissez ce formulaire pour devenir vendeur sur Ecomm-Burkina
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="businessName">Nom de l'entreprise*</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Votre boutique ou entreprise"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Type d'entreprise*</Label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="boutique">Boutique physique</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="artisan">Artisan</option>
                      <option value="distributeur">Distributeur</option>
                      <option value="particulier">Particulier</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description de l'entreprise*</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez votre entreprise, vos produits et services..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="contactEmail">Email de contact*</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="contact@votre-entreprise.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Téléphone de contact*</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="+226 XX XX XX XX"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Adresse*</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Votre adresse complète"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Informations */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pourquoi devenir vendeur?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Store className="h-5 w-5 text-orange-500 mt-1" />
                <div>
                  <h4 className="font-medium">Accès à des milliers de clients</h4>
                  <p className="text-sm text-muted-foreground">
                    Toucher une large audience au Burkina Faso
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-orange-500 mt-1" />
                <div>
                  <h4 className="font-medium">Gestion simple</h4>
                  <p className="text-sm text-muted-foreground">
                    Interface intuitive pour gérer vos produits et commandes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-orange-500 mt-1" />
                <div>
                  <h4 className="font-medium">Support dédié</h4>
                  <p className="text-sm text-muted-foreground">
                    Assistance technique et support commercial
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conditions requises</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Compte utilisateur actif</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Informations d'entreprise valides</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Produits conformes aux normes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Capacité de livraison</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>vendeur@ecomm-burkina.bf</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+226 XX XX XX XX</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
