import ProductBrowser from "./ProductBrowser";

export default function ProductIndex() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Modern E-commerce Store
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Discover amazing products at great prices
            </p>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <ProductBrowser />
    </div>
  );
}
