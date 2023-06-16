import architectInventory from '@architect/inventory'
import invariant from 'tiny-invariant'

import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { convertToCapitalCase } from '~/utils/misc.ts'

let client: DynamoDB
let TableName: string
export const getClient = async (): Promise<{
	client: DynamoDB
	TableName: string
}> => {
	if (client && TableName) {
		return {
			client,
			TableName,
		}
	}
	const { inv } = await architectInventory()
	const tables = inv?.tables || []
	invariant(
		tables.length == 1,
		'dynamodb tables must be defined in app.arc and follow the single table pattern',
	)
	const tableName = tables[0].name
	const appName = inv?.app
	invariant(appName, 'arc app name must be defined in app.arc')
	const region = process.env.AWS_REGION || 'us-west-2'
	if (process.env.ARC_ENV === 'testing') {
		const port = process.env.ARC_TABLES_PORT ?? 5555
		let config = {
			endpoint: `http://localhost:${port}`,
			region,
		}
		client = new DynamoDB(config)
		const searchString = appName + '-staging-' + tableName
		const results = await client.listTables({})
		const tableNames = results.TableNames || []
		TableName =
			tableNames.find(function (tableName) {
				return tableName.includes(searchString)
			}) || ''
		invariant(TableName, 'arc sandbox table not found')
	} else if (
		process.env.ARC_ENV === 'staging' ||
		process.env.ARC_ENV === 'production'
	) {
		client = new DynamoDB({ region })
		// Arc tables are in the format eg BookitProduction-CampiagnProcessingTable-HV3X5HY8XL3P
		const searchString =
			convertToCapitalCase(appName) +
			convertToCapitalCase(process.env.ARC_ENV) +
			'-' +
			convertToCapitalCase(tableName) +
			'Table'
		const results = await client.listTables({})
		const tableNames = results.TableNames || []
		TableName =
			tableNames.find(function (tableName) {
				return tableName.includes(searchString)
			}) || ''
		invariant(TableName, 'aws table not found')
	} else {
		throw new Error('process.env.ARC_ENV must be set')
	}

	return {
		client,
		TableName,
	}
}
