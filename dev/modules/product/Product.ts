export class Product {
	id: number;
	name: string;
	description: string;
	price: number;
	image: string;
	uid?: string;

	constructor(
		id: number,
		name: string,
		description: string,
		price: number,
		image: string
	) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.image = image;
	}
}

export default Product;
