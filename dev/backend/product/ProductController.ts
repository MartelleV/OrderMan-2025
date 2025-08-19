import {Product} from '../../modules/product/Product';
import ProductService from './ProductService';

class ProductController {
	private productService: ProductService;

	constructor() {
		this.productService = new ProductService();
	}

	async fetchProducts(): Promise<any[]> {
		try {
			return await this.productService.fetchProducts();
		} catch (error) {
			console.error('Error fetching products:', error);
			throw error;
		}
	}

	async fetchProductDetails(productId: number): Promise<any> {
		try {
			const product = await this.productService.fetchProductDetails(
				productId
			);
			if (!product) {
				throw new Error('Product not found');
			}
			return product;
		} catch (error) {
			console.error('Error fetching product details:', error);
			throw error;
		}
	}

	async updateProduct(
		productId: number,
		productData: any
	): Promise<Product | null> {
		try {
			const updatedProduct = await this.productService.updateProduct(
				productId,
				productData
			);
			if (!updatedProduct) {
				throw new Error('Product not found');
			}
			return updatedProduct;
		} catch (error) {
			console.error('Error updating product:', error);
			throw error;
		}
	}
}

export default ProductController;
