// import { Injectable } from '@nestjs/common';
// import { DataSource, Repository } from 'typeorm';
// import { OrderEntity } from '../entities/order.entity';
// import { OrderFilterDto } from '../dto/order-filter.dto';
// import { OrderStatusEnum } from '../enums/order-status.enum';
//
// @Injectable()
// export class OrderRepository extends Repository<OrderEntity> {
//     constructor(private dataSource: DataSource) {
//         super(OrderEntity, dataSource.createEntityManager());
//     }
//
//     async findOrdersWithFilter(filter: OrderFilterDto): Promise<[OrderEntity[], number]> {
//         const query = this.createQueryBuilder('order')
//             .leftJoinAndSelect('order.user', 'user')
//             .leftJoinAndSelect('order.orderDetails', 'orderDetails')
//             .leftJoinAndSelect('orderDetails.product', 'product')
//             .select([
//                 'order',
//                 'user.id',
//                 'user.username',
//                 'user.fullName',
//                 'user.email',
//                 'orderDetails',
//                 'product.id',
//                 'product.name',
//                 'product.price',
//             ])
//             .skip((filter.page - 1) * filter.limit)
//             .take(filter.limit)
//             .orderBy('order.createdAt', 'DESC');
//
//         if (filter.status) {
//             query.andWhere('order.status = :status', { status: filter.status });
//         }
//
//         if (filter.userId) {
//             query.andWhere('user.id = :userId', { userId: filter.userId });
//         }
//
//         if (filter.fromDate) {
//             query.andWhere('DATE(order.createdAt) >= :fromDate', { fromDate: filter.fromDate });
//         }
//
//         if (filter.toDate) {
//             query.andWhere('DATE(order.createdAt) <= :toDate', { toDate: filter.toDate });
//         }
//
//         return query.getManyAndCount();
//     }
//
//     async findOrderById(id: number): Promise<OrderEntity> {
//         return this.createQueryBuilder('order')
//             .leftJoinAndSelect('order.user', 'user')
//             .leftJoinAndSelect('order.orderDetails', 'orderDetails')
//             .leftJoinAndSelect('orderDetails.product', 'product')
//             .where('order.id = :id', { id })
//             .select([
//                 'order',
//                 'user.id',
//                 'user.username',
//                 'user.fullName',
//                 'user.email',
//                 'orderDetails',
//                 'product.id',
//                 'product.name',
//                 'product.price',
//             ])
//             .getOne();
//     }
//
//     async updateOrderStatus(id: number, status: OrderStatusEnum): Promise<void> {
//         await this.update(id, { status });
//     }
//
//     async getOrderStatistics(): Promise<any> {
//         const today = new Date();
//         const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//         const startOfYear = new Date(today.getFullYear(), 0, 1);
//
//         const totalOrders = await this.count();
//         const totalRevenue = await this.createQueryBuilder('order')
//             .select('SUM(order.price)', 'total')
//             .where('order.status != :deleted', { deleted: OrderStatusEnum.DELETED })
//             .getRawOne();
//
//         const monthlyStats = await this.createQueryBuilder('order')
//             .select([
//                 'COUNT(*) as orderCount',
//                 'SUM(order.price) as revenue',
//                 "DATE_FORMAT(order.createdAt, '%Y-%m') as month"
//             ])
//             .where('order.createdAt >= :startOfYear', { startOfYear })
//             .andWhere('order.status != :deleted', { deleted: OrderStatusEnum.DELETED })
//             .groupBy("DATE_FORMAT(order.createdAt, '%Y-%m')")
//             .orderBy('month', 'DESC')
//             .getRawMany();
//
//         const statusStats = await this.createQueryBuilder('order')
//             .select('order.status', 'status')
//             .addSelect('COUNT(*)', 'count')
//             .groupBy('order.status')
//             .getRawMany();
//
//         return {
//             totalOrders,
//             totalRevenue: totalRevenue.total || 0,
//             monthlyStats,
//             statusStats,
//         };
//     }
// }