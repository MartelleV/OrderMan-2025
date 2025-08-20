import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productApi } from "../../lib/api";
import type { Product } from "../../types";
import { useCart } from "../../hooks/useCart";

export default function DetailIndex() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await productApi.getById(Number(id));
      setProduct(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch product details", err);
      setError("Failed to fetch product details");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      alert("Added to cart!");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <p className="mt-2">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md mx-auto">
          <h4 className="text-red-800 font-semibold">Error!</h4>
          <p className="text-red-600">{error || "Product not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-md"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 lg:h-full object-cover object-center"
              />
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>
              <div className="mb-8">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-700 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 px-6 rounded-md font-medium hover:bg-gray-300 transition-colors"
                >
                  Back to Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
