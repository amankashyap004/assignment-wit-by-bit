import React, { useState, useEffect } from "react";
import { Product, Category } from "@/types";
import { Button } from "../ui/button";
import ProductList from "./ProductList";
import AddProductForm from "./AddProductForm";
import AddCategoryModal from "./AddCategoryModal";

function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setCategories(data.categories);
      });
  }, []);

  const handleAddProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
    setShowAddProduct(false);
  };

  const handleAddCategory = (categoryName: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryName,
    };
    setCategories([...categories, newCategory]);
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {showAddProduct ? (
        <AddProductForm
          categories={categories.map((cat) => cat.name)}
          onAddProduct={handleAddProduct}
          onCancel={() => setShowAddProduct(false)}
        />
      ) : (
        <div className="flex flex-col justify-start items-start gap-8 w-full h-full overflow-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center w-full gap-4">
            <h1 className="text-2xl font-bold">Products</h1>
            <div className="space-x-4">
              <Button
                onClick={() => setShowAddCategory(true)}
                className="bg-[#E1E7EB] text-[#1F8CD0] hover:bg-[#1F8CD0] hover:text-white"
              >
                Add Category
              </Button>
              <Button
                onClick={() => setShowAddProduct(true)}
                className="bg-[#1F8CD0] text-white hover:bg-[#E1E7EB] hover:text-[#1F8CD0]"
              >
                Add Product
              </Button>
            </div>
          </div>

          <ProductList products={products} categories={categories} />
        </div>
      )}

      {showAddCategory && (
        <AddCategoryModal
          onAddCategory={handleAddCategory}
          onClose={() => setShowAddCategory(false)}
        />
      )}
    </div>
  );
}

export default ProductManagement;
