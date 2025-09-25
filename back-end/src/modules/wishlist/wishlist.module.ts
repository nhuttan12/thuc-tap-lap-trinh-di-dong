/**
 * @description Wishlist module
 * @author Nhut Tan
 * @since 2025-09-23
 * @version 1.0.0
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistItemEntity } from './entities/wishlist-item.entity';
import { WishlistItemRepository } from './repositories/wishlist-item.repository';
import { WishlistService } from './wishlist.service';
import { WishlistItemMapper } from './mappers/wishlist-item.mapper';
import { HelperModule } from '../../common/helper/helper.module';
import { WishlistController } from './wishlist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistItemEntity]), HelperModule],
  providers: [WishlistItemRepository, WishlistService, WishlistItemMapper],
  exports: [],
  controllers: [WishlistController],
})
export class WishlistModule {}
