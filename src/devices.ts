import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

/**
 * Find the corresponding tenant for this device
 *
 * @param client The dynamodb configured client
 * @param tableName Name of the device table
 * @param deviceId The id of the device
 */
export async function findDevice(
	client: DynamoDBClient,
	tableName: string,
	deviceId: string,
): Promise<{ [key: string]: any }> {
	const data = await client.send(
		new QueryCommand({
			TableName: tableName,
			IndexName: 'deviceId-index',
			KeyConditionExpression: 'deviceId = :deviceId',
			ExpressionAttributeValues: {
				':deviceId': {
					S: deviceId,
				},
			},
		}),
	)

	if (data?.Items && data.Items.length > 0) {
		return unmarshall(data.Items[0])
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
): Promise<{ [key: string]: any }[]> {
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
			return unmarshall(item)
		})
	} else {
		throw new Error('Items not found')
	}
}
