"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  name: string;
  category: string;
  brand: string;
  description: string;
  image: string;
  variants: {
    name: string;
    values: string[];
  }[];
  combinations: {
    [key: string]: {
      name: string;
      sku: string;
      quantity: number | null;
      inStock: boolean;
    };
  };
  priceInr: number;
  discount: {
    method: string; // "pct" | "flat"
    value: number;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    variants: [],
    combinations: {},
    discount: { method: "pct", value: 0 },
  });
  const [newCategory, setNewCategory] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch data from data.json
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setCategories(data.categories);
      });
  }, []);

  const handleAddProduct = () => {
    if (isProductValid()) {
      const newProductWithImage = {
        ...newProduct,
        image: imageFile
          ? URL.createObjectURL(imageFile)
          : "/images/shoes-image.png",
      };
      setProducts([...products, newProduct as Product]);
      setNewProduct({
        variants: [],
        combinations: {},
        discount: { method: "pct", value: 0 },
      });
      setImageFile(null);
      setShowAddProduct(false);
      setCurrentStep(1);
    }
  };

  const handleAddCategory = () => {
    if (newCategory) {
      const newCat: Category = { id: Date.now().toString(), name: newCategory };
      setCategories([...categories, newCat]);
      setNewCategory("");
      setShowAddCategory(false);
    }
  };

  const isProductValid = () => {
    return (
      newProduct.name &&
      newProduct.category &&
      newProduct.brand &&
      newProduct.priceInr &&
      newProduct.variants &&
      newProduct.variants.length > 0 &&
      Object.keys(newProduct.combinations || {}).length > 0
    );
  };

  const addVariant = () => {
    setNewProduct({
      ...newProduct,
      variants: [...(newProduct.variants || []), { name: "", values: [] }],
    });
  };

  const updateVariant = (
    index: number,
    field: "name" | "values",
    value: string
  ) => {
    const updatedVariants = [...(newProduct.variants || [])];
    if (field === "name") {
      updatedVariants[index].name = value;
    } else {
      updatedVariants[index].values = value.split(",").map((v) => v.trim());
    }
    setNewProduct({ ...newProduct, variants: updatedVariants });
  };

  const generateCombinations = () => {
    if (!newProduct.variants || newProduct.variants.length === 0) return;

    const variantNames = newProduct.variants.map((v) => v.name);
    const variantValues = newProduct.variants.map((v) => v.values);

    const combinations: {
      [key: string]: {
        name: string;
        sku: string;
        quantity: number | null;
        inStock: boolean;
      };
    } = {};

    const generateHelper = (current: string[], depth: number) => {
      if (depth === variantNames.length) {
        const key = current.join("/");
        combinations[key] = {
          name: key,
          sku: "",
          quantity: null,
          inStock: false,
        };
        return;
      }

      for (let value of variantValues[depth]) {
        generateHelper([...current, value], depth + 1);
      }
    };

    generateHelper([], 0);
    setNewProduct({ ...newProduct, combinations });
  };

  const updateCombination = (
    key: string,
    field: "sku" | "quantity" | "inStock",
    value: string | number | boolean
  ) => {
    const updatedCombinations = { ...newProduct.combinations };
    updatedCombinations[key] = {
      ...updatedCombinations[key],
      [field]: value,
    };
    setNewProduct({ ...newProduct, combinations: updatedCombinations });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const renderAddProductStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <Input
              type="text"
              placeholder="Product Name"
              className="mb-2"
              value={newProduct.name || ""}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <Select
              value={newProduct.category}
              onValueChange={(value) =>
                setNewProduct({ ...newProduct, category: value })
              }
            >
              <SelectTrigger className="mb-2">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Brand"
              className="mb-2"
              value={newProduct.brand || ""}
              onChange={(e) =>
                setNewProduct({ ...newProduct, brand: e.target.value })
              }
            />
            <div className="flex items-center space-x-2">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => document.getElementById("image-upload")?.click()}
                className="flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
            {imageFile && (
              <div className="mt-2 flex justify-center">
                <div className="relative w-32 h-32">
                  <Image
                    src={URL.createObjectURL(imageFile)}
                    alt="Product preview"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Variants</h3>
            {newProduct.variants &&
              newProduct.variants.map((variant, index) => (
                <div key={index} className="mb-2">
                  <Input
                    type="text"
                    placeholder="Variant Name (e.g., Size, Color)"
                    className="mb-1"
                    value={variant.name}
                    onChange={(e) =>
                      updateVariant(index, "name", e.target.value)
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Variant Values (comma-separated)"
                    value={variant.values.join(", ")}
                    onChange={(e) =>
                      updateVariant(index, "values", e.target.value)
                    }
                  />
                </div>
              ))}
            <Button onClick={addVariant} className="mt-2">
              Add Variant
            </Button>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Combinations</h3>
            <Button onClick={generateCombinations} className="mb-2">
              Generate Combinations
            </Button>
            {newProduct.combinations &&
              Object.entries(newProduct.combinations).map(
                ([key, combination]) => (
                  <div key={key} className="mb-2 p-2 border rounded">
                    <p className="font-semibold">{combination.name}</p>
                    <Input
                      type="text"
                      placeholder="SKU"
                      className="mb-1"
                      value={combination.sku}
                      onChange={(e) =>
                        updateCombination(key, "sku", e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      className="mb-1"
                      value={combination.quantity || ""}
                      onChange={(e) =>
                        updateCombination(
                          key,
                          "quantity",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={combination.inStock}
                        onChange={(e) =>
                          updateCombination(key, "inStock", e.target.checked)
                        }
                        className="mr-2"
                      />
                      In Stock
                    </label>
                  </div>
                )
              )}
          </>
        );
      case 4:
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Price Info</h3>
            <Input
              type="number"
              placeholder="Price (INR)"
              className="mb-2"
              value={newProduct.priceInr || ""}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  priceInr: parseInt(e.target.value),
                })
              }
            />
            <Select
              value={newProduct.discount?.method}
              onValueChange={(value) =>
                setNewProduct({
                  ...newProduct,
                  // discount: { ...newProduct.discount, method: value },
                  discount: {
                    method: newProduct.discount?.method || "",
                    value: parseInt(value),
                  },
                })
              }
            >
              <SelectTrigger className="mb-2">
                <SelectValue placeholder="Discount Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pct">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Discount Value"
              value={newProduct.discount?.value || ""}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  discount: {
                    method: newProduct.discount?.method || "",
                    value: parseInt(e.target.value),
                  },
                })
              }
              // onChange={(e) =>
              //   setNewProduct({
              //     ...newProduct,
              //     discount: {
              //       ...newProduct.discount,
              //       value: parseInt(e.target.value),
              //     },
              //   })
              // }
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {showAddProduct ? (
        <div className="flex flex-col h-full">
          <header className="bg-white shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">Add Product</h1>
            </div>

            <div className="flex justify-between items-center gap-4">
              {currentStep === 1 && (
                <Button
                  className="bg-[#E1E7EB] text-[#1F8CD0] hover:bg-[#1F8CD0] hover:text-white px-10 font-semibold"
                  onClick={() => setShowAddProduct(false)}
                >
                  Cancel
                </Button>
              )}
              {currentStep > 1 && (
                <Button
                  className="bg-[#E1E7EB] text-[#1F8CD0] hover:bg-[#1F8CD0] hover:text-white px-10 font-semibold"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Back
                </Button>
              )}
              {currentStep < 4 ? (
                <Button
                  className="hover:bg-[#E1E7EB] hover:text-[#1F8CD0] bg-[#1F8CD0] text-white px-10 font-semibold"
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  className="hover:bg-[#E1E7EB] hover:text-[#1F8CD0] bg-[#1F8CD0] text-white px-10 font-semibold"
                  onClick={handleAddProduct}
                  disabled={!isProductValid()}
                >
                  Confirm
                </Button>
              )}
            </div>
          </header>
          <div className="flex-1 overflow-auto p-4">
            <div className="flex flex-col justify-start items-start w-full gap-6">
              <div className="flex items-center">
                {["Description", "Variants", "Combinations", "Price"].map(
                  (step, index) => (
                    <div
                      key={step}
                      className="flex items-center justify-start gap-3"
                    >
                      <div
                        className={`flex items-center justify-center rounded-xl px-6 py-1 font-semibold text-lg ${
                          currentStep >= index + 1
                            ? "bg-[#DAEDF9] text-[#1F8CD0]"
                            : "text-[#808080]"
                        }`}
                      >
                        <span className="">{step}</span>
                      </div>

                      {index < 3 && (
                        <ChevronRight className="h-6 w-6 text-[#808080] font-semibold text-lg" />
                      )}
                    </div>
                  )
                )}
              </div>
              <div className="bg-white shadow-lg rounded-lg px-4 py-6 w-full lg:w-1/2">
                {renderAddProductStep()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-start items-start gap-8 w-full h-full overflow-auto">
          <div className="flex justify-between items-center w-full">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full h-full">
            {categories.map((category) => (
              <div key={category.id} className="bg-[#F8F8F8] p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
                <div className="flex flex-col justify-start items-start gap-4 overflow-auto">
                  {products
                    .filter((product) => product.category === category.name)
                    .map((product, index) => (
                      <div
                        key={index}
                        className="flex justify-start items-start w-full h-full gap-4 p-3 rounded-lg bg-white text-black"
                      >
                        <div className="flex justify-center items-center w-36 h-24 rounded-lg bg-[#F8F8F8] p-1">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={200}
                            height={200}
                            className="w-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex flex-col justify-between items-start w-full h-full gap-4">
                          <div>
                            <h3 className="text-xl font-semibold">
                              {product.name}
                            </h3>
                            <p className="">₹{product.priceInr}</p>
                          </div>
                          <div className="bg-[#E1E7EB] text-[#1F8CD0] hover:bg-[#1F8CD0] hover:text-white px-4 py-1 rounded">
                            <p className="text-sm font-medium">
                              {product.brand}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Category</h2>
            <Input
              type="text"
              placeholder="Category Name"
              className="mb-4"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button onClick={handleAddCategory} disabled={!newCategory}>
                Add
              </Button>
              <Button onClick={() => setShowAddCategory(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
