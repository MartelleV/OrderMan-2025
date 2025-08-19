import Product from '../../modules/product/Product';
import {db} from '../firebase';
import {collection, doc, getDocs, query, updateDoc, where,} from 'firebase/firestore';
import DomModel from '../../modules/DomModel';

class ProductService {
	async fetchProducts(): Promise<any[]> {
		const productRef = collection(db, 'product');
		const snapshot = await getDocs(productRef);
		return snapshot.docs.map(doc => {
			const data = doc.data();
			const product = new Product(
				data.id,
				data.name,
				data.description,
				data.price,
				data.image
			);
			product.uid = doc.id;
			DomModel.addProduct(product);
			return {uid: doc.id, ...data};
		});
	}

	async fetchProductDetails(productId: number): Promise<any> {
		let product = DomModel.getProductById(productId);
		if (!product) {
			const productRef = collection(db, 'product');
			const q = query(productRef, where('id', '==', productId));
			const snapshot = await getDocs(q);
			if (!snapshot.empty) {
				const doc = snapshot.docs[0];
				const data = doc.data();
				product = new Product(
					data.id,
					data.name,
					data.description,
					data.price,
					data.image
				);
				product.uid = doc.id;
				DomModel.addProduct(product);
				return { uid: doc.id, ...data };
			}
			return null;
		}
		return product;
	}

	async updateProduct(
		productId: number,
		productData: any
	): Promise<Product | null> {
		let product = DomModel.getProductById(productId);
		if (!product) {
			product = await this.fetchProductDetails(productId);
			if (!product) return null;
		}

		Object.assign(product, productData);

		if (product.uid) {
			const productDoc = doc(db, 'product', product.uid);
			await updateDoc(productDoc, productData);
		}
		return product;
	}
}

export default ProductService;
