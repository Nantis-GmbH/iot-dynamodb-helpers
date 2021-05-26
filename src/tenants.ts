import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

export type TenantResult = {
	tenantId: string
	tier: string
}

/**
 * Find the corresponding tenant
 *
 * @param client The dynamodb configured client
 * @param tableName Name of the tenant table
 * @param tenantId The id of the tenant
 */
export async function findTenant(
	client: DynamoDBClient,
	tableName: string,
	tenantId: string,
): Promise<TenantResult> {
	const data = await client.send(
		new QueryCommand({
			TableName: tableName,
			KeyConditionExpression: 'tenantId = :tenantId',
			ExpressionAttributeValues: {
				':tenantId': {
					S: tenantId,
				},
			},
		}),
	)

	if (data?.Items && data.Items.length > 0) {
		return <TenantResult>unmarshall(data.Items[0])
	} else {
		throw new Error('Item not found')
	}
}
