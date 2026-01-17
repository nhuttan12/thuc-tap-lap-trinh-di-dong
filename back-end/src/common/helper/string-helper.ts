/**
 * @description Extract string by delimeter
 * @author Nhut Tan
 * @since 2025-09-17
 * @version 1.0.0
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class StringHelper {
	extractStringByDelimeter(str: string, delimeter: string): string[] {
		return str.split(delimeter);
	}
}
