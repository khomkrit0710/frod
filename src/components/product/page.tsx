'use client'

import productsData from '../../data/products.json'

export default function ProductPage() {
  const { products } = productsData

  const ProductCard = ({ product }: { product: any }) => (
    <div className="minimal-card p-6">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-32 object-cover rounded-md mb-2"
      />
      <h3 className="text-base font-light text-blue-900 mb-1">{product.name}</h3>
      <p className="minimal-text text-xs mb-2 line-clamp-2">{product.description}</p>
      
      <div className="mb-2">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-base font-light text-blue-900">{product.price}</span>
          <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
          <span className="text-xs text-red-600 bg-red-50 px-1 py-0.5 rounded">
            ลด {product.discount} บาท
          </span>
        </div>
        <p className="text-xs text-gray-600">ประกัน: {product.warranty}</p>
      </div>

      <div className="mb-2">
        <div className="flex gap-1 mb-1">
          {product.colors.map((color: string, index: number) => (
            <span key={index} className="text-xs bg-blue-50 text-blue-600 px-1 py-0.5 rounded">
              {color}
            </span>
          ))}
        </div>
        <ul className="text-xs text-gray-600 space-y-0.5">
          {product.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-center gap-1">
              <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-1">
        <button className="flex-1 minimal-button bg-blue-600 text-white hover:bg-blue-700 text-xs">
          ติดต่อเรา
        </button>
        <button className="flex-1 minimal-button border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-xs">
          Line
        </button>
      </div>
    </div>
  )

  return (
    <section id="products" className="minimal-section bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="minimal-heading">อุปกรณ์ตกแต่ง</h2>
          <p className="minimal-subheading">อุปกรณ์ตกแต่งคุณภาพสูงสำหรับรถยนต์ Ford</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
