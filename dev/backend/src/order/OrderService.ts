import { PrismaClient } from '@prisma/client';
import { Order, OrderData } from '../../../modules/order/Order';
import { Customer } from '../../../modules/customer/Customer';
import DomModel from '../../../modules/DomModel';

const prisma = new PrismaClient();

class OrderService {
	private createOrderFromRecord(orderRecord: any): Order {
		const order = new Order({
			...orderRecord,
			customerBankAccount: orderRecord.customerBankAccount || undefined,
			totalAmount: Number(orderRecord.totalAmount),
			items:
				orderRecord.items?.map((item: any) => ({
					...item,
					productId: item.productId || undefined,
					price: Number(item.price),
				})) || [],
		});
		DomModel.addOrder(order);
		return order;
	}

	private async getCustomerFromDatabase(
		customerId: number
	): Promise<Customer | null> {
		const customerRecord = await prisma.customer.findUnique({
			where: { id: customerId },
		});

		if (customerRecord) {
			return new Customer(
				customerRecord.id,
				customerRecord.name,
				customerRecord.address,
				customerRecord.phone,
				customerRecord.bankAccount || undefined,
				customerRecord.createdAt,
				customerRecord.updatedAt
			);
		}
		return null;
	}

	async createOrder(data: OrderData): Promise<Order> {
		let customer = DomModel.getCustomerById(data.customerId);
		if (!customer) {
			customer = await this.getCustomerFromDatabase(data.customerId);
			if (customer) {
				DomModel.addCustomer(customer);
			} else {
				throw new Error('Customer not found');
			}
		}

		const { id, items, createdAt, updatedAt, ...orderCreateData } = data;

		const orderRecord = await prisma.order.create({
			data: {
				...orderCreateData,
				status: 'pending',
				orderDate: data.orderDate || new Date(),
			},
		});

		const orderItems = await Promise.all(
			data.items.map(item => {
				const {
					id: itemId,
					orderId: existingOrderId,
					createdAt: itemCreatedAt,
					updatedAt: itemUpdatedAt,
					...itemCreateData
				} = item;
				return prisma.orderItem.create({
					data: {
						orderId: orderRecord.id,
						...itemCreateData,
					},
				});
			})
		);

		return this.createOrderFromRecord({
			...orderRecord,
			items: orderItems,
		});
	}

	async getOrder(orderId: number): Promise<Order | null> {
		let order = DomModel.getOrderById(orderId);
		if (!order) {
			const orderRecord = await prisma.order.findUnique({
				where: { id: orderId },
				include: { items: true },
			});
			if (orderRecord) {
				order = this.createOrderFromRecord(orderRecord);
			}
		}
		return order || null;
	}

	async getOrdersByCustomer(customerId: number): Promise<Order[]> {
		const orderRecords = await prisma.order.findMany({
			where: { customerId },
			include: { items: true },
			orderBy: { createdAt: 'desc' },
		});
		return orderRecords.map(record => this.createOrderFromRecord(record));
	}

	async updateOrder(
		orderId: number,
		update: Partial<OrderData>
	): Promise<Order | null> {
		try {
			const { id, items, createdAt, updatedAt, ...updateData } = update;
			const orderRecord = await prisma.order.update({
				where: { id: orderId },
				data: updateData,
				include: { items: true },
			});
			return this.createOrderFromRecord(orderRecord);
		} catch (error) {
			console.error('Error updating order:', error);
			return null;
		}
	}

	async deleteOrder(orderId: number): Promise<boolean> {
		try {
			await prisma.order.delete({
				where: { id: orderId },
			});
			return true;
		} catch (error) {
			console.error('Error deleting order:', error);
			return false;
		}
	}

	async updateOrderStatus(
		orderId: number,
		status: string
	): Promise<Order | null> {
		try {
			const orderRecord = await prisma.order.update({
				where: { id: orderId },
				data: { status: status as any },
				include: { items: true },
			});
			return this.createOrderFromRecord(orderRecord);
		} catch (error) {
			console.error('Error updating order status:', error);
			return null;
		}
	}

	async getAllOrders(): Promise<Order[]> {
		const orderRecords = await prisma.order.findMany({
			include: { items: true },
			orderBy: { createdAt: 'desc' },
		});
		return orderRecords.map(record => this.createOrderFromRecord(record));
	}
}

export default OrderService;
