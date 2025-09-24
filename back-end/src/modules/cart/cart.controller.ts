/**
 * @description Cart controller
 * @author Nhut Tan
 * @since 2025-09-24
 * @version 1.0.0
 */

import { Controller, Logger } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDetailService } from './cart-detail.service';

@Controller('cart')
export class CartController {
  private readonly logger: Logger = new Logger(CartController.name);

  constructor(
    private readonly cartService: CartService,
    private readonly cartDetailService: CartDetailService,
  ) {}
}
