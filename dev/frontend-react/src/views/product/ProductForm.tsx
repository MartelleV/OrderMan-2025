import type { Product } from "../../types";
import { useCart } from "../../hooks/useCart";

interface ProductFormProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductForm({
  product,
  showAddToCart = true,
}: ProductFormProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h5 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h5>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-bold text-emerald-600">
            ${product.price.toFixed(2)}
          </span>
          {showAddToCart && (
            <button
              onClick={handleAddToCart}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
