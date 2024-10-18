import React from "react";
import Image from "next/image";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="flex justify-start items-start w-full h-full gap-4 p-2 lg:p-3 rounded-lg bg-white text-black">
      <div className="flex justify-center items-center w-36 h-24 rounded-lg bg-[#F8F8F8] p-1">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          quality={100}
          priority
          className="w-full object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-col justify-between items-start w-full h-full gap-4">
        <div>
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <p className="">₹{product.priceInr}</p>
        </div>
        <div className="bg-[#E1E7EB] text-[#1F8CD0] hover:bg-[#1F8CD0] hover:text-white px-4 py-1 rounded">
          <p className="text-sm font-medium">{product.brand}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
