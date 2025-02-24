import { Metadata } from 'next';
import { api } from '~/trpc/server';
import ProductDetailsClient from './_components/pageClient';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dataProduct = await api.Product.getOne({
    query: params.slug || '',
    hasCategory: true,
    hasCategoryChild: true
  });

  return {
    title: `${dataProduct?.name || 'Sản phẩm'} | Phụng Food Restaurant`,
    description: dataProduct?.description || 'Chi tiết sản phẩm tại Phụng Food Restaurant'
  };
}

export default async function ProductDetail({ params }: Props) {
  const dataProduct = await api.Product.getOne({
    query: params.slug || '',
    hasCategory: true,
    hasCategoryChild: true
  });

  const dataRelatedProducts = await api.Product.getFilter({
    query: dataProduct?.subCategory?.tag || ''
  });
  const dataHintProducts = await api.Product.getFilter({
    query: dataProduct?.subCategory?.category?.tag || ''
  });

  if (!dataProduct) {
    return <p>Sản phẩm không tồn tại</p>;
  }

  return (
    <ProductDetailsClient
      dataProduct={dataProduct}
      dataRelatedProducts={dataRelatedProducts}
      dataHintProducts={dataHintProducts}
    />
  );
}
