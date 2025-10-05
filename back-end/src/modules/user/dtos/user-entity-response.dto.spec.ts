import { UserEntityResponseDto } from './user-entity-response.dto'

describe('UserEntityResponseDto', () => {
	it('should be defined', (): void => {
		const userEntityResponseDto = new UserEntityResponseDto()
		expect(userEntityResponseDto).toBeDefined()
	})
})
