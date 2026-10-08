export type StoreProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
};

const initialProducts: StoreProduct[] = [
  {
    id: "p001",
    name: "Mechanical Keyboard",
    price: 2590,
    description: "คีย์บอร์ด Mechanical สำหรับทำงานและเล่นเกม",
  },
  {
    id: "p002",
    name: "Wireless Mouse",
    price: 1290,
    description: "เมาส์ไร้สาย น้ำหนักเบา",
  },
  {
    id: "p003",
    name: "USB-C Hub",
    price: 1890,
    description: "USB-C Hub พร้อม HDMI และ Card Reader",
  },
];

declare global {
  var shopProducts: StoreProduct[] | undefined;
}

const products = globalThis.shopProducts ?? structuredClone(initialProducts);

if (process.env.NODE_ENV !== "production") {
  globalThis.shopProducts = products;
}

export function getProducts(): StoreProduct[] {
  return products;
}

export function getProduct(id: string): StoreProduct | undefined {
  return products.find((product) => product.id === id);
}

export function updateProduct(
  id: string,
  values: Pick<StoreProduct, "name" | "price" | "description">,
): void {
  const product = getProduct(id);
  if (!product) {
    throw new Error("Product not found");
  }

  product.name = values.name;
  product.price = values.price;
  product.description = values.description;
}

export function deleteProduct(id: string): void {
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) {
    throw new Error("Product not found");
  }

  products.splice(index, 1);
}
