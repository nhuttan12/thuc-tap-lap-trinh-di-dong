import { UserDetailEntity } from './user-detail.entity'

describe('UserDetailEntity', (): void => {
	it('should be defined', () => {
		const userDetail = new UserDetailEntity()
		expect(userDetail).toBeDefined()
	})

	it('should assign address 1, address 2, address 3', (): void => {
		const userDetail = new UserDetailEntity()
		userDetail.address1 = 'address1'
		userDetail.address2 = 'address2'
		userDetail.address3 = 'address3'

		expect(userDetail.address1).toBe('address1')
		expect(userDetail.address2).toBe('address2')
		expect(userDetail.address3).toBe('address3')
	})
})
