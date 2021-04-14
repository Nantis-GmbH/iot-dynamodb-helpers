import { DynamoDBClient } from './__mocks__/@aws-sdk/client-dynamodb'
import { findActiveDevice } from './devices'

const db = new DynamoDBClient()

describe('find device', () => {
	test('should return a device when available', async () => {
		const device = await findActiveDevice(db, 'devicesTable', 'id_available')
		expect(device.deviceId).toBe('id_available')
		expect(device.tenantId).toBe('test')
	})

	test('should return null when no item is resolved', async () => {
		try {
			await findActiveDevice(db, 'devicesTable', 'id_not_available')
		} catch (e) {
			expect(e.message).toBe('Item not found')
		}
	})
})
