import type { Metadata } from 'next'
import { FavouritesPage } from '@/views/FavouritesPage'

export const metadata: Metadata = {
  title: 'My Favourites',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <FavouritesPage />
}
