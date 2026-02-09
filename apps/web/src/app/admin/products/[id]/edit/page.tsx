import { notFound, redirect } from 'next/navigation';
import { prisma } from '@ecomm-burkina/database';
import { ProductForm } from '@/components/admin/product-form';

export default async function EditProductPage(props: any) {
  const { params } = props;
  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

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
        <h1 className="text-3xl font-bold">Modifier le produit</h1>
        <p className="text-muted-foreground">
          Modifiez les informations du produit "{product.name}"
        </p>
      </div>

      <ProductForm
        product={product}
        categories={categories}
        isEditing={true}
      />
    </div>
  );
}
