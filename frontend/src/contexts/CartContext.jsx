import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import * as api from '../services/api'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([])
      setTotal(0)
      return
    }
    setLoading(true)
    try {
      const data = await api.getCart()
      setItems(data.items || [])
      setTotal(parseFloat(data.total) || 0)
    } catch {
      setItems([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addItem = async (productId, quantity = 1) => {
    if (!user) {
      throw new Error('Not authenticated')
    }
    await api.addToCart(productId, quantity)
    await refresh()
  }

  const updateItem = async (itemId, quantity) => {
    await api.updateCartItem(itemId, quantity)
    await refresh()
  }

  const removeItem = async (itemId) => {
    await api.removeCartItem(itemId)
    await refresh()
  }

  const clear = () => {
    setItems([])
    setTotal(0)
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, total, count, loading,
      addItem, updateItem, removeItem, clear, refresh,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
