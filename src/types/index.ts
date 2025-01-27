export interface GuitarT {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

export interface CartItemT extends GuitarT {
  quantity: number;
}

//export type GuitarIDT = GuitarT['id'];
// export type CartItem = GuitarT & { quantity: number };

// Utility types
