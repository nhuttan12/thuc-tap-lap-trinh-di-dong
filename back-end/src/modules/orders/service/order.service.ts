// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
// import { OrderRepository } from '../repository/order.repository';
// import { OrderEntity } from '../entities/order.entity';
// import { OrderDetailEntity } from '../entities/order-detail.entity';
// import { UserEntity } from '../../user/entities/user.entity';
// import { ProductEntity } from '../../product/entities/product.entity';
// import { CreateOrderDto } from '../dto/create-order.dto';
// import { UpdateOrderDto } from '../dto/update-order.dto';
// import { OrderFilterDto } from '../dto/order-filter.dto';
// import { OrderResponseDto, OrderItemResponseDto } from '../dto/order-response.dto';
// import { OrderStatusEnum } from '../enums/order-status.enum';
//
// @Injectable()
// export class OrderService {
//     constructor(
//         @InjectRepository(OrderRepository)
//         private orderRepository: OrderRepository,
//         private dataSource: DataSource,
//     ) {}
//
//     async findAll(filter: OrderFilterDto): Promise<{ orders: OrderResponseDto[]; total: number }> {
//         const [orders, total] = await this.orderRepository.findOrdersWithFilter(filter);
//
//         const orderResponses = orders.map(order => this.mapToResponseDto(order));
//
//         return { orders: orderResponses, total };
//     }
//
//     async findOne(id: number): Promise<OrderResponseDto> {
//         const order = await this.orderRepository.findOrderById(id);
//
//         if (!order) {
//             throw new NotFoundException(`Order with ID ${id} not found`);
//         }
//
//         return this.mapToResponseDto(order);
//     }
//
//     async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
//         const queryRunner = this.dataSource.createQueryRunner();
//         await queryRunner.connect();
//         await queryRunner.startTransaction();
//
//         try {
//             // Check user exists
//             const user = await queryRunner.manager.findOne(UserEntity, {
//                 where: { id: createOrderDto.userId }
//             });
//
//             if (!user) {
//                 throw new BadRequestException(`User with ID ${createOrderDto.userId} not found`);
//             }
//
//             // Create order
//             const order = new OrderEntity();
//             order.user = user;
//             order.price = createOrderDto.price;
//             order.status = createOrderDto.status;
//
//             const savedOrder = await queryRunner.manager.save(OrderEntity, order);
//
//             // Create order details
//             const orderDetails = [];
//             for (const item of createOrderDto.items) {
//                 // Check product exists
//                 const product = await queryRunner.manager.findOne(ProductEntity, {
//                     where: { id: item.productId }
//                 });
//
//                 if (!product) {
//                     throw new BadRequestException(`Product with ID ${item.productId} not found`);
//                 }
//
//                 const orderDetail = new OrderDetailEntity();
//                 orderDetail.order = savedOrder;
//                 orderDetail.product = product;
//                 orderDetail.quantity = item.quantity;
//                 orderDetail.price = item.price;
//
//                 orderDetails.push(orderDetail);
//             }
//
//             await queryRunner.manager.save(OrderDetailEntity, orderDetails);
//
//             await queryRunner.commitTransaction();
//
//             return this.findOne(savedOrder.id);
//         } catch (error) {
//             await queryRunner.rollbackTransaction();
//             throw error;
//         } finally {
//             await queryRunner.release();
//         }
//     }
//
//     async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
//         const order = await this.orderRepository.findOne({ where: { id } });
//
//         if (!order) {
//             throw new NotFoundException(`Order with ID ${id} not found`);
//         }
//
//         if (updateOrderDto.userId && updateOrderDto.userId !== order.user.id) {
//             const user = await this.dataSource.manager.findOne(UserEntity, {
//                 where: { id: updateOrderDto.userId }
//             });
//
//             if (!user) {
//                 throw new BadRequestException(`User with ID ${updateOrderDto.userId} not found`);
//             }
//
//             order.user = user;
//         }
//
//         if (updateOrderDto.price) {
//             order.price = updateOrderDto.price;
//         }
//
//         if (updateOrderDto.status) {
//             order.status = updateOrderDto.status;
//         }
//
//         await this.orderRepository.save(order);
//
//         return this.findOne(id);
//     }
//
//     async updateStatus(id: number, status: OrderStatusEnum): Promise<void> {
//         const order = await this.orderRepository.findOne({ where: { id } });
//
//         if (!order) {
//             throw new NotFoundException(`Order with ID ${id} not found`);
//         }
//
//         await this.orderRepository.updateOrderStatus(id, status);
//     }
//
//     async remove(id: number): Promise<void> {
//         const order = await this.orderRepository.findOne({ where: { id } });
//
//         if (!order) {
//             throw new NotFoundException(`Order with ID ${id} not found`);
//         }
//
//         await this.orderRepository.updateOrderStatus(id, OrderStatusEnum.DELETED);
//     }
//
//     async getStatistics(): Promise<any> {
//         return this.orderRepository.getOrderStatistics();
//     }
//
//     private mapToResponseDto(order: OrderEntity): OrderResponseDto {
//         const response = new OrderResponseDto();
//
//         response.id = order.id;
//         response.userId = order.user?.id;
//         response.username = order.user?.username;
//         response.fullName = order.user?.fullName;
//         response.email = order.user?.email;
//         response.price = order.price;
//         response.status = order.status;
//         response.createdAt = order.createdAt;
//         response.updatedAt = order.updatedAt;
//
//         response.items = order.orderDetails?.map(detail => {
//             const item = new OrderItemResponseDto();
//             item.id = detail.id;
//             item.productId = detail.product?.id;
//             item.productName = detail.product?.name;
//             item.quantity = detail.quantity;
//             item.price = detail.price;
//             item.total = detail.quantity * detail.price;
//             return item;
//         }) || [];
//
//         return response;
//     }
// }