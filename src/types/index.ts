export interface Product {
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

export interface Category {
  id: string;
  name: string;
}
