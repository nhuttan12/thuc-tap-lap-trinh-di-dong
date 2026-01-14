// import {
//     Controller,
//     Get,
//     Post,
//     Body,
//     Patch,
//     Param,
//     Delete,
//     Query,
//     HttpStatus,
//     ParseIntPipe,
//     UseInterceptors,
//     ClassSerializerInterceptor,
// } from '@nestjs/common';
// import {
//     ApiTags,
//     ApiOperation,
//     ApiResponse,
//     ApiParam,
//     ApiQuery,
//     ApiBearerAuth,
// } from '@nestjs/swagger';
// import { OrderService } from '../service/order.service';
// import { CreateOrderDto } from '../dto/create-order.dto';
// import { UpdateOrderDto } from '../dto/update-order.dto';
// import { OrderFilterDto } from '../dto/order-filter.dto';
// import { OrderResponseDto } from '../dto/order-response.dto';
// import { OrderStatusEnum } from '../enums/order-status.enum';
//
// @ApiTags('Admin - Orders')
// @ApiBearerAuth()
// @Controller('admin/orders')
// @UseInterceptors(ClassSerializerInterceptor)
// export class OrderController {
//     constructor(private readonly orderService: OrderService) {}
//
//     @Get()
//     @ApiOperation({ summary: 'Lấy danh sách đơn hàng với filter' })
//     @ApiResponse({
//         status: HttpStatus.OK,
//         description: 'Danh sách đơn hàng',
//         type: OrderResponseDto,
//         isArray: true,
//     })
//     async findAll(@Query() filter: OrderFilterDto) {
//         return this.orderService.findAll(filter);
//     }
//
//     @Get('statistics')
//     @ApiOperation({ summary: 'Lấy thống kê đơn hàng' })
//     @ApiResponse({
//         status: HttpStatus.OK,
//         description: 'Thống kê đơn hàng',
//     })
//     async getStatistics() {
//         return this.orderService.getStatistics();
//     }
//
//     @Get(':id')
//     @ApiOperation({ summary: 'Lấy chi tiết đơn hàng' })
//     @ApiParam({ name: 'id', description: 'ID đơn hàng' })
//     @ApiResponse({
//         status: HttpStatus.OK,
//         description: 'Chi tiết đơn hàng',
//         type: OrderResponseDto,
//     })
//     @ApiResponse({
//         status: HttpStatus.NOT_FOUND,
//         description: 'Không tìm thấy đơn hàng',
//     })
//     async findOne(@Param('id', ParseIntPipe) id: number) {
//         return this.orderService.findOne(id);
//     }
//
//     @Post()
//     @ApiOperation({ summary: 'Tạo đơn hàng mới' })
//     @ApiResponse({
//         status: HttpStatus.CREATED,
//         description: 'Đơn hàng đã được tạo',
//         type: OrderResponseDto,
//     })
//     @ApiResponse({
//         status: HttpStatus.BAD_REQUEST,
//         description: 'Dữ liệu không hợp lệ',
//     })
//     async create(@Body() createOrderDto: CreateOrderDto) {
//         return this.orderService.create(createOrderDto);
//     }
//
//     @Patch(':id')
//     @ApiOperation({ summary: 'Cập nhật đơn hàng' })
//     @ApiParam({ name: 'id', description: 'ID đơn hàng' })
//     @ApiResponse({
//         status: HttpStatus.OK,
//         description: 'Đơn hàng đã được cập nhật',
//         type: OrderResponseDto,
//     })
//     @ApiResponse({
//         status: HttpStatus.NOT_FOUND,
//         description: 'Không tìm thấy đơn hàng',
//     })
//     async update(
//         @Param('id', ParseIntPipe) id: number,
//         @Body() updateOrderDto: UpdateOrderDto,
//     ) {
//         return this.orderService.update(id, updateOrderDto);
//     }
//
//     @Patch(':id/status')
//     @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng' })
//     @ApiParam({ name: 'id', description: 'ID đơn hàng' })
//     @ApiQuery({ name: 'status', enum: OrderStatusEnum, description: 'Trạng thái mới' })
//     @ApiResponse({
//         status: HttpStatus.OK,
//         description: 'Trạng thái đã được cập nhật',
//     })
//     @ApiResponse({
//         status: HttpStatus.NOT_FOUND,
//         description: 'Không tìm thấy đơn hàng',
//     })
//     async updateStatus(
//         @Param('id', ParseIntPipe) id: number,
//         @Query('status') status: OrderStatusEnum,
//     ) {
//         return this.orderService.updateStatus(id, status);
//     }
//
//     @Delete(':id')
//     @ApiOperation({ summary: 'Xóa đơn hàng (soft delete)' })
//     @ApiParam({ name: 'id', description: 'ID đơn hàng' })
//     @ApiResponse({
//         status: HttpStatus.OK,
//         description: 'Đơn hàng đã được xóa',
//     })
//     @ApiResponse({
//         status: HttpStatus.NOT_FOUND,
//         description: 'Không tìm thấy đơn hàng',
//     })
//     async remove(@Param('id', ParseIntPipe) id: number) {
//         return this.orderService.remove(id);
//     }
// }