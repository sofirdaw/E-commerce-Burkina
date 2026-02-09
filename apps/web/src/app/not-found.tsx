import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Page non trouvée
          </h2>
          <p className="text-gray-600 mb-8">
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
          
          <Link href="/products">
            <Button variant="outline" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Parcourir les produits
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>Ecomm-Burkina - Votre Marketplace Premium</p>
        </div>
      </div>
    </div>
  );
}
