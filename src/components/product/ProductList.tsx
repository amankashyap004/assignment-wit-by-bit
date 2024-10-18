import React from "react";
import { Product, Category } from "@/types";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  categories: Category[];
}

const ProductList: React.FC<ProductListProps> = ({ products, categories }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full h-full">
      {categories.map((category) => (
        <div key={category.id} className="bg-[#F8F8F8] p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
          <div className="flex flex-col justify-start items-start gap-4 overflow-auto">
            {products
              .filter((product) => product.category === category.name)
              .map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
