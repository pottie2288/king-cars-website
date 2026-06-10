import type { Metadata } from 'next';
import { HomePage } from './HomePage';

export const metadata: Metadata = {
  title: 'King Cars | Affordable Pre-Owned Cars in Cape Town & Gqeberha',
  description: 'Browse 28+ brands of quality pre-owned cars across 6 branches in Cape Town (Bellville, Vredekloof, Brackenfell) and Gqeberha (17th Ave, Sydenham, Newton Park). 2-year unlimited km warranty. Finance available.',
};

export default function Page() {
  return <HomePage />;
}
