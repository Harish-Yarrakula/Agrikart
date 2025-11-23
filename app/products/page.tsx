export default function ProductsPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Our Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard
          name="Organic Tomatoes"
          description="Fresh organic tomatoes grown locally"
          price={3.99}
          farmer="Green Valley Farm"
        />
        <ProductCard
          name="Fresh Milk"
          description="Fresh cow milk from grass-fed cows"
          price={4.50}
          farmer="Sunny Meadows Farm"
        />
        <ProductCard
          name="Free Range Eggs"
          description="Farm fresh eggs from free range chickens"
          price={5.99}
          farmer="Happy Hens Farm"
        />
        <ProductCard
          name="Organic Carrots"
          description="Crisp and sweet organic carrots"
          price={2.99}
          farmer="Green Valley Farm"
        />
        <ProductCard
          name="Fresh Honey"
          description="Pure raw honey from local bees"
          price={8.99}
          farmer="Bee Happy Farm"
        />
      </div>
    </div>
  )
}

function ProductCard({ 
  name, 
  description, 
  price, 
  farmer 
}: { 
  name: string
  description: string
  price: number
  farmer: string
}) {
  return (
    <div className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className="text-gray-600 mb-3">{description}</p>
      <p className="text-sm text-gray-500 mb-2">Farmer: {farmer}</p>
      <p className="text-2xl font-bold text-primary">${price.toFixed(2)}</p>
      <button className="mt-4 w-full bg-primary text-white py-2 px-4 rounded hover:bg-secondary transition-colors">
        Add to Cart
      </button>
    </div>
  )
}
