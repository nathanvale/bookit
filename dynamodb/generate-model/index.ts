import fs from 'fs'
import * as url from 'node:url'
import { UserItem } from 'dynamodb/models/user/user.server.ts'
import type { TableData } from './types.ts'
import { getEmptyDataModel } from './utils.ts'

import { TEST_USER_ID, TEST_SESSION_ID } from 'dynamodb/db-test-helpers.ts'

import { SessionItem } from 'dynamodb/models/session/session.server.ts'

export async function main() {
	const testUser = new UserItem({
		createdAt: '2022-08-31T05:46:41.205Z',
		updatedAt: '2022-11-25T13:45:46.999Z',
		userId: TEST_USER_ID,
		email: 'test@test.com',
		password: '$2a$12$9AW1GJShZ3fd42xjtWyaUeA6BIlLJOByxj9vV90Rnoa9I1iEjYwyq',
		name: 'Test User',
		username: 'test_user',
		image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
	})

	const testUser2 = new UserItem({
		createdAt: '2022-08-31T05:46:41.205Z',
		updatedAt: '2022-11-25T13:45:46.999Z',
		userId: '54321',
		email: 'test2@test.com',
		password: '$2a$12$9AW1GJShZ3fd42xjtWyaUeA6BIlLJOByxj9vV90Rnoa9I1iEjYwyq',
		name: 'Test User 2',
		username: 'test_user_2',
		image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
	})

	const testSession = new SessionItem({
		createdAt: '2022-08-31T05:46:41.205Z',
		updatedAt: '2022-11-25T13:45:46.999Z',
		expirationDate: '2022-11-25T13:45:46.999Z',
		sessionId: TEST_SESSION_ID,
		userId: TEST_USER_ID,
	})

	const tableData: TableData = [
		testSession.toDynamoDBItem(),
		testUser.toDynamoDBItem(),
		testUser2.toDynamoDBItem(),
	]

	const dataModel = getEmptyDataModel(tableData)

	const json = JSON.stringify(dataModel, null, 2)
	const outputPath = process.cwd() + '/dynamodb/data-model.json'

	console.log('Writing JSON file to:', outputPath)

	fs.writeFile(outputPath, json, 'utf8', err => {
		if (err) {
			console.error('Error writing JSON file:', err)
		} else {
			console.log(`JSON file has been created successfully oa ${outputPath}!`)
		}
	})
}

if (import.meta.url.startsWith('file:')) {
	const modulePath = url.fileURLToPath(import.meta.url)
	if (process.argv[1] === modulePath) {
		main()
	}
}
