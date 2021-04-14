import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'

import { unmarshall } from '@aws-sdk/util-dynamodb'

export type DeviceResult = {
	deviceId: string
	tenantId: string
	tier: string
	active: boolean
}

/**
 * Find the corresponding tenant for this device
 *
 * @param client The dynamodb configured client
 * @param tableName Name of the device table
 * @param deviceId The id of the device
 */
export async function findActiveDevice(
	client: DynamoDBClient,
	tableName: string,
	deviceId: string,
): Promise<DeviceResult> {
	const data = await client.send(
		new QueryCommand({
			TableName: tableName,
			IndexName: 'deviceId-index',
			KeyConditionExpression: 'deviceId = :deviceId',
			FilterExpression: '#active = :active',
			ExpressionAttributeValues: {
				':deviceId': {
					S: deviceId,
				},
				':active': {
					BOOL: true,
				},
			},
			ExpressionAttributeNames: {
				'#active': 'active',
			},
		}),
	)

	if (data?.Items && data.Items.length > 0) {
		return <DeviceResult>unmarshall(data.Items[0])
	} else {
		throw new Error('Item not found')
	}
}

/**
 * Find the corresponding tenant for this device
 *
 * @param client The dynamodb configured client
 * @param tableName Name of the device table
 * @param deviceId The id of the device
 */
export async function findDevices(
	client: DynamoDBClient,
	tableName: string,
	deviceId: string,
): Promise<DeviceResult[]> {
	const data = await client.send(
		new QueryCommand({
			TableName: tableName,
			IndexName: 'deviceId-index',
			KeyConditionExpression: 'deviceId = :deviceId',
			ExpressionAttributeValues: {
				[':deviceId']: {
					S: deviceId,
				},
			},
		}),
	)

	if (data?.Items && data.Items.length > 0) {
		return data.Items.map((item) => {
			return <DeviceResult>unmarshall(item)
		})
	} else {
		throw new Error('Items not found')
	}
}
