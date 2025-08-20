import { PrismaClient } from '@prisma/client';
import Product from '../../../modules/product/Product';
import DomModel from '../../../modules/DomModel';

const prisma = new PrismaClient();

class ProductService {
	private createProductFromRecord(record: any): Product {
		const product = new Product(
			record.id,
			record.name,
			record.description,
			Number(record.price),
			record.image,
			record.createdAt,
			record.updatedAt
		);
		DomModel.addProduct(product);
		return product;
	}

	async fetchProducts(): Promise<Product[]> {
		const productRecords = await prisma.product.findMany({
			orderBy: { createdAt: 'desc' },
		});
		return productRecords.map(record =>
			this.createProductFromRecord(record)
		);
	}

	async fetchProductDetails(productId: number): Promise<Product | null> {
		let product = DomModel.getProductById(productId);
		if (!product) {
			const productRecord = await prisma.product.findUnique({
				where: { id: productId },
			});
			if (productRecord) {
				product = this.createProductFromRecord(productRecord);
			}
		}
		return product || null;
	}

	async updateProduct(
		productId: number,
		productData: Partial<{
			name: string;
			description: string;
			price: number;
			image: string;
		}>
	): Promise<Product | null> {
		try {
			const productRecord = await prisma.product.update({
				where: { id: productId },
				data: productData,
			});
			return this.createProductFromRecord(productRecord);
		} catch (error) {
			console.error('Error updating product:', error);
			return null;
		}
	}

	async createProduct(data: {
		name: string;
		description: string;
		price: number;
		image: string;
	}): Promise<Product> {
		const productRecord = await prisma.product.create({ data });
		return this.createProductFromRecord(productRecord);
	}

	// Delete Product
	async deleteProduct(productId: number): Promise<boolean> {
		try {
			await prisma.product.delete({
				where: { id: productId },
			});
			return true;
		} catch (error) {
			console.error('Error deleting product:', error);
			return false;
		}
	}
}

export default ProductService;
