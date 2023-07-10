import {
	json,
	type DataFunctionArgs,
	type V2_MetaFunction,
} from '@remix-run/node'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { GeneralErrorBoundary } from '~/components/error-boundary.tsx'
import { authenticator, requireAnonymous } from '~/utils/auth.server.ts'
import { commitSession, getSession } from '~/utils/session.server.ts'
import { InlineLogin } from '../resources+/login.tsx'
import { Verifier, unverifiedSessionKey } from '../resources+/verify.tsx'
import { AuthShell } from '~/components/auth-shell.tsx'

export async function loader({ request }: DataFunctionArgs) {
	await requireAnonymous(request)
	const session = await getSession(request.headers.get('cookie'))
	const error = session.get(authenticator.sessionErrorKey)
	let errorMessage: string | null = null
	if (typeof error?.message === 'string') {
		errorMessage = error.message
	}
	return json(
		{ formError: errorMessage, unverified: session.has(unverifiedSessionKey) },
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	)
}

export const meta: V2_MetaFunction = () => {
	return [{ title: 'Login to Epic Notes' }]
}

export default function LoginPage() {
	const [searchParams] = useSearchParams()
	const data = useLoaderData<typeof loader>()

	const redirectTo = searchParams.get('redirectTo') || '/'

	return (
		<AuthShell title="Welcome back!">
			{data.unverified ? (
				<Verifier redirectTo={redirectTo} />
			) : (
				<InlineLogin redirectTo={redirectTo} formError={data.formError} />
			)}
		</AuthShell>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
