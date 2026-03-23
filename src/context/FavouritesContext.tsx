'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface FavouritesContextType {
  favourites: string[]
  toggleFavourite: (carId: string) => void
  isFavourite: (carId: string) => boolean
  favouritesCount: number
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined)

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('king-cars-favourites')
    if (saved) {
      try {
        setFavourites(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse favourites', e)
        localStorage.removeItem('king-cars-favourites')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('king-cars-favourites', JSON.stringify(favourites))
  }, [favourites])

  const toggleFavourite = (carId: string) => {
    setFavourites(prev =>
      prev.includes(carId)
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    )
  }

  const isFavourite = (carId: string) => favourites.includes(carId)

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite, isFavourite, favouritesCount: favourites.length }}>
      {children}
    </FavouritesContext.Provider>
  )
}

export function useFavourites() {
  const context = useContext(FavouritesContext)
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider')
  }
  return context
}
