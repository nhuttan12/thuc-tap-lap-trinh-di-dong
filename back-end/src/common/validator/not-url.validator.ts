/**
 * @description Not url validator
 * @author Nhut Tan
 * @since 2025-09-22
 * @version 1.0.0
 */

import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator'
import * as url from 'url'
import { ValidateStatusCode } from '../dtos/status-code/validate.status-code'

@ValidatorConstraint({ name: 'notUrl', async: false })
export class NotUrlValidator implements ValidatorConstraintInterface {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	validate(text: string, args: ValidationArguments): boolean {
		// Parse the input text as a URL
		const parsedUrl: any = url.parse(text)

		// Check if the URL protocol is either "http" or "https"
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
			return false // Input contains a URL
		}

		return true // Input does NOT contain a URL
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	defaultMessage(args: ValidationArguments): string {
		return ValidateStatusCode.TextMustNotContainUrl.message
	}
}
