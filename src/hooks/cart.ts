import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";
import type { GuitarT, CartItemT } from '../types';

export const useCart = () => {

  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart());

  // Almacenar el carrito desde el localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const MAX_ITEMS = 5;

  function addToCart(item: GuitarT) {
    const existingItemIndex = cart.findIndex(
      (cartItem: CartItemT) => cartItem.id === item.id
    );

    if (existingItemIndex !== -1) {
      if (cart[existingItemIndex].quantity >= MAX_ITEMS) {
        return;
      }
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity++;
      setCart(updatedCart);
    } else {
      // Si el ítem no existe, lo agrega con cantidad 1
      item.quantity = 1;
      setCart((prevCart: CartItemT[]) => [...prevCart, item]);
    }
    saveLocalStorage();
  }

  function removeItemFromCart(guitarId:GuitarT['id']): void {
    const updatedCart:CartItemT = cart.filter((guitar:GuitarT) => guitar.id !== guitarId);
    setCart(updatedCart);
  }
  // Haz que esta función retorno un valor de tipo CartItemT
  function increaseQuantity(guitarId:GuitarT['id']) {
    const updatedCart:CartItemT = cart.map((cartItem:CartItemT) => {
      if (cartItem.id === guitarId) {
        if (cartItem.quantity >= MAX_ITEMS) {
          return cartItem;
        }
        cartItem.quantity++;
      }
      return updatedCart;
    });
    // Imprimir por consola el valor del carrito
    setCart(updatedCart);
  }

  function reduceQuantity(guitarId:GuitarT['id']): void {
    const updatedCart:CartItemT[] = cart.map((cartItem:CartItemT) => {
      if (cartItem.id === guitarId) {
        cartItem.quantity--;
      }
      return cartItem;
    });
    // Elimina el ítem si la cantidad es igual o menor a 0
    setCart(updatedCart.filter((cartWithoutZero:CartItemT) => cartWithoutZero.quantity > 0));
  }

  function clearCart() : void{
    setCart([]);
  }

  function saveLocalStorage() : void {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // State Derivado + useMemo
  const isEmpyCart = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(() => cart.reduce((acc:number, item: CartItemT) => acc + item.price * item.quantity, 0), [cart]);

  return {
    data,
    cart,
    addToCart,
    removeItemFromCart,
    increaseQuantity,
    reduceQuantity,
    clearCart,
    isEmpyCart,
    cartTotal,
  };
};
