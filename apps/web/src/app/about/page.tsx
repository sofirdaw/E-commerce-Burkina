'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  Users, 
  Award,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        console.log('✅ Message envoyé avec succès');
      } else {
        alert(`Erreur: ${data.error || 'Une erreur est survenue'}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            Message Envoyé!
          </h1>
          <p className="mb-6 text-muted-foreground">
            Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
          </p>
          <div className="space-y-2">
            <Link href="/">
              <Button className="w-full">
                Retour à l'accueil
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', subject: '', message: '' });
              }}
            >
              Envoyer un autre message
            </Button>
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
        <h1 className="mb-2 text-3xl font-bold">À Propos de Ecomm-Burkina</h1>
        <p className="text-muted-foreground">
          Votre marketplace de confiance au Burkina Faso 🇧🇫
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Notre Histoire */}
          <Card>
            <CardHeader>
              <CardTitle>Notre Histoire</CardTitle>
              <CardDescription>
                Une passion pour le commerce digital au Burkina
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Ecomm-Burkina est né de la vision de révolutionner le commerce en ligne au Burkina Faso. 
                Nous croyons que chaque commerçant mérite d'avoir accès aux outils digitaux modernes 
                pour développer son activité.
              </p>
              <p className="text-muted-foreground">
                Notre plateforme connecte les vendeurs locaux avec des milliers de clients à travers tout le pays, 
                offrant une expérience d'achat sécurisée et pratique avec des méthodes de paiement adaptées 
                au contexte burkinabè.
              </p>
              <div className="grid gap-4 md:grid-cols-3 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">1000+</div>
                  <div className="text-sm text-muted-foreground">Vendeurs partenaires</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">50K+</div>
                  <div className="text-sm text-muted-foreground">Produits disponibles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">100K+</div>
                  <div className="text-sm text-muted-foreground">Clients satisfaits</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nos Valeurs */}
          <Card>
            <CardHeader>
              <CardTitle>Nos Valeurs</CardTitle>
              <CardDescription>
                Ce qui guide notre action chaque jour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Inclusion</h4>
                    <p className="text-sm text-muted-foreground">
                      Donner accès au commerce digital à tous, peu importe la taille de l'entreprise
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Qualité</h4>
                    <p className="text-sm text-muted-foreground">
                      Sélectionner les meilleurs vendeurs et garantir la satisfaction client
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Communication</h4>
                    <p className="text-sm text-muted-foreground">
                      Maintenir un dialogue transparent avec nos partenaires et clients
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Local</h4>
                    <p className="text-sm text-muted-foreground">
                      Promouvoir le commerce local et l'économie burkinabè
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire de Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contactez-nous</CardTitle>
              <CardDescription>
                Une question? Une suggestion? Nous sommes là pour vous écouter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Nom complet*</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom et prénom"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email*</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Sujet*</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Quel est le sujet de votre message?"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message*</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre demande en détail..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Direct */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Direct</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">contact@ecomm-burkina.bf</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium">Téléphone</div>
                  <div className="text-sm text-muted-foreground">+226 XX XX XX XX</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium">Adresse</div>
                  <div className="text-sm text-muted-foreground">
                    Ouagadougou, Burkina Faso
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Horaires */}
          <Card>
            <CardHeader>
              <CardTitle>Horaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-600" />
                <div className="text-sm">
                  <div className="font-medium">Lundi - Vendredi</div>
                  <div className="text-muted-foreground">8h00 - 18h00</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-600" />
                <div className="text-sm">
                  <div className="font-medium">Samedi</div>
                  <div className="text-muted-foreground">9h00 - 15h00</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-600" />
                <div className="text-sm">
                  <div className="font-medium">Dimanche</div>
                  <div className="text-muted-foreground">Fermé</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Réseaux Sociaux */}
          <Card>
            <CardHeader>
              <CardTitle>Suivez-nous</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="secondary" className="cursor-pointer hover:bg-orange-100">
                  Facebook
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-orange-100">
                  Instagram
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-orange-100">
                  WhatsApp
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Support Vendeurs */}
          <Card>
            <CardHeader>
              <CardTitle>Support Vendeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Vous êtes vendeur et besoin d'aide?
              </p>
              <Link href="/become-vendor">
                <Button variant="outline" className="w-full">
                  Devenir vendeur
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
