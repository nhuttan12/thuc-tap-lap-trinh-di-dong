/*
 * @description decorator used for getting role to access controller
 * @author Nhut Tan
 * @since 2025-09-09
 * @version 1.0.0
 */

import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<string[]>();
