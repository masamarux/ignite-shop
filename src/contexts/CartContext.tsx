import { createContext, ReactNode, useState } from 'react'

interface CartItem {
  id: string;
  name: string;
  price: number;

}

export interface CartContextData {
  cart: CartItem[]
}

const CartContext = createContext({} as CartContextData)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([])

  return (
    <CartContext.Provider
      value={{
        cart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}