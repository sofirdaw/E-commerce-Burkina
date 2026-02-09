import { prisma } from '@ecomm-burkina/database';
import { ProductForm } from '@/components/admin/product-form';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nouveau produit</h1>
        <p className="text-muted-foreground">
          Ajoutez un nouveau produit à votre catalogue
        </p>
      </div>

      <ProductForm
        categories={categories}
        isEditing={false}
      />
    </div>
  );
}
