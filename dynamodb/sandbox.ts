import {
	createUser,
	deleteUserById,
	getUserByEmail,
	getUserByUsername,
	readUser,
	updateUser,
} from './models/user/user.server.ts'
import { setTimeout } from 'timers/promises'
import os from 'os'
import { createSession, readSession } from './models/session/session.server.ts'
import { createUserSeed } from 'dynamodb/seed-utils.ts'
import sandbox from '@architect/sandbox'
import { promisify } from 'util'
import { exec as execCallback } from 'child_process'

const exec = promisify(execCallback)

function isMacOs() {
	return os.platform() === 'darwin'
}

const PORT = '8888'

export async function setup() {
	if (isMacOs() && !process.env.CI) {
		// Kill port 8888 if it's already in use
		await exec(`lsof -i tcp:${PORT} | awk 'NR!=1 {print $2}' | xargs kill -9 ;`)
		// Needs a fraction of a second to actually kill the process
		await setTimeout(100)
	}
	process.env.PORT = process.env.PORT ?? PORT
	process.env.QUIET = process.env.QUIET ?? '1'
	process.env.ARC_TABLES_PORT = process.env.ARC_TABLES_PORT ?? '5555'
	await sandbox.start()
}

export async function teardown() {
	await sandbox.end()
}

;(async () => {
	await setup()
	const user = await readUser('12345') //?
	await createUser(createUserSeed()) //?
	await createUser(createUserSeed()) //?
	await createUser(createUserSeed()) //?
	await createUser(createUserSeed()) //?
	await createUser(createUserSeed()) //?
	await createUser(createUserSeed()) //?
	await createUser(createUserSeed()) //?
	const createdUser = await createUser(createUserSeed()) //?
	await deleteUserById(createdUser.userId) //?
	await getUserByUsername('test_user') //?
	await getUserByEmail('test@test.com') //?
	//const items = await getAllUsernames() //?
	if (user) {
		await updateUser({
			...user,
			name: 'Updated User',
		}) //?
		const createdSession = await createSession({
			expirationDate: new Date(Date.now() + 100000).toISOString(),
			userId: user.userId,
		}) //?
		await readSession(createdSession.sessionId) //?
	}
	await getUserByUsername('nathanvale') //?

	//const unprocessed = await deleteAllUserSessions('12345') //?
	//console.log(unprocessed)
	await teardown()
	// console.log(session)
})()
