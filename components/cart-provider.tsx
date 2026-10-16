"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import type { Product } from "@/lib/products"

export type CartItem = {
  id: number
  nombre: string
  precio: number
  imagen: string
  cantidad: number
}

type CartContextValue = {
  items: CartItem[]
  cantidadTotal: number
  total: number
  abierto: boolean
  setAbierto: (abierto: boolean) => void
  agregar: (producto: Product) => void
  quitar: (id: number) => void
  cambiarCantidad: (id: number, cantidad: number) => void
  vaciar: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [abierto, setAbierto] = useState(false)

  const agregar = useCallback((producto: Product) => {
    setItems((prev) => {
      const existente = prev.find((item) => item.id === producto.id)
      if (existente) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item,
        )
      }
      return [
        ...prev,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          cantidad: 1,
        },
      ]
    })
    setAbierto(true)
  }, [])

  const quitar = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const cambiarCantidad = useCallback((id: number, cantidad: number) => {
    setItems((prev) =>
      prev.flatMap((item) => {
        if (item.id !== id) return [item]
        if (cantidad < 1) return []
        return [{ ...item, cantidad }]
      }),
    )
  }, [])

  const vaciar = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      cantidadTotal: items.reduce((suma, item) => suma + item.cantidad, 0),
      total: items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
      abierto,
      setAbierto,
      agregar,
      quitar,
      cambiarCantidad,
      vaciar,
    }
  }, [items, abierto, agregar, quitar, cambiarCantidad, vaciar])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider")
  }
  return context
}
