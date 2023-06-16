import { json, type DataFunctionArgs } from '@remix-run/node'
import { createUser, readUser } from 'dynamodb/models/user/user.server.ts'
import { createUserSeed } from 'dynamodb/seed-utils.ts'

export async function loader({ request }: DataFunctionArgs) {
	// try {
	const createdUser = await createUser(createUserSeed()) //?
	const user = await readUser(createdUser.userId) //?
	return json({ user }, { status: 200 })
}
