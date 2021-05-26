export { QueryCommand as QueryCommand } from '@aws-sdk/client-dynamodb'

const sendFn = jest.fn().mockImplementation(async (command) => {
	const input = command.input

	const id = input.ExpressionAttributeValues[':deviceId'].S

	if (id == 'id_available') {
		return Promise.resolve({
			Items: [
				{
					tenantId: {
						S: 'test',
					},
					deviceId: {
						S: id,
					},
					type: {
						S: 'test',
					},
				},
			],
		})
	} else {
		return Promise.resolve({
			Items: [],
		})
	}
})

export class DynamoDBClient {
	send = sendFn
	config: any
	middlewareStack: any
	destroy: any
}
