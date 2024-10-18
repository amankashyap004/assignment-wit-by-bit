"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { ChevronRight, Upload, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AddProductFormProps {
  categories: string[];
  onAddProduct: (product: Product) => void;
  onCancel: () => void;
}

export default function AddProductForm({
  categories,
  onAddProduct,
  onCancel,
}: AddProductFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    variants: [],
    combinations: {},
    discount: { method: "pct", value: 0 },
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
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

  const handleAddProduct = () => {
    if (isProductValid()) {
      const newProductWithImage = {
        ...newProduct,
        image: imageFile
          ? URL.createObjectURL(imageFile)
          : "/images/shoes-image.png",
      };
      onAddProduct(newProductWithImage as Product);
    }
    console.log(newProduct);
  };

  const addVariant = () => {
    setNewProduct((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), { name: "", values: [] }],
    }));
  };

  const updateVariant = (
    index: number,
    field: "name" | "values",
    value: string
  ) => {
    setNewProduct((prev) => {
      const updatedVariants = [...(prev.variants || [])];
      if (field === "name") {
        updatedVariants[index].name = value;
      } else {
        updatedVariants[index].values = value.split(",").map((v) => v.trim());
      }
      return { ...prev, variants: updatedVariants };
    });
  };

  const removeVariant = (index: number) => {
    setNewProduct((prev) => {
      const updatedVariants = [...(prev.variants || [])];
      updatedVariants.splice(index, 1);
      return { ...prev, variants: updatedVariants };
    });
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
    setNewProduct((prev) => ({ ...prev, combinations }));
  };

  const updateCombination = (
    key: string,
    field: "sku" | "quantity" | "inStock",
    value: string | number | boolean
  ) => {
    setNewProduct((prev) => {
      const updatedCombinations = { ...prev.combinations };
      updatedCombinations[key] = {
        ...updatedCombinations[key],
        [field]: value,
      };
      return { ...prev, combinations: updatedCombinations };
    });
  };

  const renderDescriptionStep = () => (
    <div className="flex flex-col justify-start items-start gap-4 lg:gap-5">
      <h3 className="text-lg font-bold">Description</h3>
      <div className="w-full space-y-1">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          type="text"
          placeholder="Product Name"
          className="mb-2"
          value={newProduct.name || ""}
          onChange={(e) =>
            setNewProduct((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>
      <div className="w-full space-y-1">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={newProduct.category}
          onValueChange={(value) =>
            setNewProduct((prev) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger className="mb-2">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full space-y-1">
        <Label htmlFor="brand">Brand *</Label>
        <Input
          type="text"
          placeholder="Brand"
          className="mb-2"
          value={newProduct.brand || ""}
          onChange={(e) =>
            setNewProduct((prev) => ({ ...prev, brand: e.target.value }))
          }
        />
      </div>
      <div className="flex items-center space-x-2">
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <Button
          type="button"
          size="lg"
          onClick={() => document.getElementById("image-upload")?.click()}
          className="flex items-center bg-transparent hover:bg-transparent border border-[#1F8CD0] text-[#1F8CD0] font-bold"
        >
          <Upload className="w-4 h-4 mr-1" />
          Upload Image
        </Button>
      </div>
      {imageFile && (
        <div className="mt-2 flex justify-center">
          <div className="relative w-32 h-32">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Product preview"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderVariantsStep = () => (
    <div className="flex flex-col justify-start items-start gap-4 lg:gap-5 w-full">
      <h3 className="text-lg font-semibold mb-2">Variants</h3>
      <div className="flex justify-start items-center w-full lg:gap-4">
        <Label className="w-[40%] lg:w-[30%]">Option *</Label>
        <Label className="w-[55%] lg:w-[65%]">Values *</Label>
      </div>

      {newProduct.variants &&
        newProduct.variants.map((variant, index) => (
          <div
            key={index}
            className="flex justify-start items-center gap-2 lg:gap-4 w-full"
          >
            <Input
              className="w-[40%] lg:w-[30%]"
              placeholder="Option can't be empty"
              value={variant.name}
              onChange={(e) => updateVariant(index, "name", e.target.value)}
            />
            <Input
              className="w-[55%] lg:w-[65%]"
              placeholder="Value can't be empty"
              value={variant.values.join(",")}
              onChange={(e) => updateVariant(index, "values", e.target.value)}
            />
            <Button
              onClick={() => removeVariant(index)}
              variant="ghost"
              className="hover:bg-transparent"
            >
              <Trash2 className="w-10 h-10 text-red-500" />
            </Button>
          </div>
        ))}
      <Button
        onClick={addVariant}
        variant="ghost"
        className="mt-2 hover:bg-transparent"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Variant
      </Button>
    </div>
  );

  const renderCombinationsStep = () => (
    <div className="flex flex-col justify-start items-start gap-4 lg:gap-5 w-full">
      <h3 className="text-lg font-semibold mb-2">Combinations</h3>
      <Button
        onClick={generateCombinations}
        className="mb-2 bg-[#1F8CD0] text-white hover:bg-[#E1E7EB] hover:text-[#1F8CD0] px-6"
      >
        Generate Combinations
      </Button>
      {newProduct.combinations &&
        Object.entries(newProduct.combinations).map(([key, combination]) => (
          <div
            key={key}
            className="mb-2 lg:p-2 rounded w-full overflow-auto text-nowrap"
          >
            <Table className="border-none">
              <TableHeader>
                <TableRow className="border-none">
                  <TableHead></TableHead>
                  <TableHead>SKU *</TableHead>
                  <TableHead>In stock</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border-none">
                <TableRow>
                  <TableCell>{combination.name}</TableCell>
                  <TableCell>
                    <Input
                      value={combination.sku}
                      onChange={(e) =>
                        updateCombination(key, "sku", e.target.value)
                      }
                      placeholder="SKU can't be empty"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={combination.inStock}
                      onCheckedChange={(checked) =>
                        updateCombination(key, "inStock", checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={combination.quantity || ""}
                      onChange={(e) =>
                        updateCombination(
                          key,
                          "quantity",
                          parseInt(e.target.value)
                        )
                      }
                      placeholder="Quantity can't be empty"
                      disabled={!combination.inStock}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ))}
    </div>
  );

  const renderPriceStep = () => (
    <div className="flex flex-col justify-start items-start gap-4 lg:gap-5 w-full">
      <h3 className="text-lg font-semibold mb-2">Price Info</h3>

      <div className="w-full space-y-1">
        <Label htmlFor="price">Price *</Label>
        <Input
          type="number"
          placeholder="Price (INR)"
          className="mb-2"
          value={newProduct.priceInr || ""}
          onChange={(e) =>
            setNewProduct((prev) => ({
              ...prev,
              priceInr: parseInt(e.target.value),
            }))
          }
        />
      </div>
      <div className="w-full space-y-1">
        <Label htmlFor="discount">Discount *</Label>
        <div className="flex justify-start items-center gap-4">
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
          />
          <Select
            value={newProduct.discount?.method}
            onValueChange={(value) =>
              setNewProduct({
                ...newProduct,
                discount: {
                  method: newProduct.discount?.method || "",
                  value: parseInt(value),
                },
              })
            }
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Discount Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pct">Percentage</SelectItem>
              <SelectItem value="flat">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderAddProductStep = () => {
    switch (currentStep) {
      case 1:
        return renderDescriptionStep();
      case 2:
        return renderVariantsStep();
      case 3:
        return renderCombinationsStep();
      case 4:
        return renderPriceStep();
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <header className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white shadow-sm ">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">Add Product</h1>
        </div>
        <div className="flex justify-between items-center gap-4">
          {currentStep === 1 && (
            <Button
              className="bg-[#E1E7EB] text-[#1F8CD0] hover:bg-[#1F8CD0] hover:text-white px-10 font-semibold"
              onClick={onCancel}
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
      <div className="flex-1 overflow-auto w-full py-4 lg:px-4">
        <div className="flex flex-col justify-start items-start w-full gap-4 lg:gap-6">
          <div className="flex items-center overflow-auto w-full">
            {["Description", "Variants", "Combinations", "Price"].map(
              (step, index) => (
                <div
                  key={step}
                  className="flex items-center justify-start gap-1 lg:gap-3"
                >
                  <div
                    className={`flex items-center justify-center rounded-md lg:rounded-xl px-4 lg:px-6 py-1 font-semibold text-sm lg:text-lg ${
                      currentStep >= index + 1
                        ? "bg-[#DAEDF9] text-[#1F8CD0]"
                        : "text-[#808080]"
                    }`}
                  >
                    <span>{step}</span>
                  </div>

                  {index < 3 && (
                    <ChevronRight className="h-4 lg:h-6 w-4 lg:w-6 text-[#808080] font-semibold text-lg" />
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
  );
}
