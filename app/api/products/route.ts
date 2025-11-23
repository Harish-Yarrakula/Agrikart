import { NextResponse } from 'next/server'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  farmer: string
  stock: number
}

const products: Product[] = [
  {
    id: 1,
    name: 'Organic Tomatoes',
    description: 'Fresh organic tomatoes grown locally',
    price: 3.99,
    category: 'Vegetables',
    farmer: 'Green Valley Farm',
    stock: 100
  },
  {
    id: 2,
    name: 'Fresh Milk',
    description: 'Fresh cow milk from grass-fed cows',
    price: 4.50,
    category: 'Dairy',
    farmer: 'Sunny Meadows Farm',
    stock: 50
  },
  {
    id: 3,
    name: 'Free Range Eggs',
    description: 'Farm fresh eggs from free range chickens',
    price: 5.99,
    category: 'Poultry',
    farmer: 'Happy Hens Farm',
    stock: 75
  },
  {
    id: 4,
    name: 'Organic Carrots',
    description: 'Crisp and sweet organic carrots',
    price: 2.99,
    category: 'Vegetables',
    farmer: 'Green Valley Farm',
    stock: 120
  },
  {
    id: 5,
    name: 'Fresh Honey',
    description: 'Pure raw honey from local bees',
    price: 8.99,
    category: 'Other',
    farmer: 'Bee Happy Farm',
    stock: 30
  }
]

export async function GET() {
  return NextResponse.json(products)
}
