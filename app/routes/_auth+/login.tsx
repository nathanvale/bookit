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
import { ThemeSwitch } from '../resources+/theme/index.tsx'

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
		<>
			<div className="container relative flex h-[800px] flex-col items-center justify-center sm:grid  lg:max-w-none lg:grid-cols-2 lg:px-0">
				<ThemeSwitch className="absolute right-4 top-4 md:right-8 md:top-8" />
				<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
					<div className="absolute inset-0 bg-zinc-900" />
					<div className="relative z-20 flex items-center text-lg font-medium">
						Bookit
					</div>
					<div className="relative z-20 mt-auto">
						<blockquote className="space-y-2">
							<p className="text-lg">
								The bookit app is amazing, it has completely changed my
								business!
							</p>
							<footer className="text-sm">Nathan Vale</footer>
						</blockquote>
					</div>
				</div>
				<div className="w-full lg:p-8">
					<div className="mx-auto flex w-full flex-col justify-center space-y-9 sm:w-[350px]">
						<div className="flex flex-col space-y-2 text-center">
							<h1 className="text-2xl font-semibold tracking-tight">
								Log in to your account
							</h1>
							<p className="text-sm text-muted-foreground">
								Welcome back! We're so excited to see you again!
							</p>
						</div>
						{data.unverified ? (
							<Verifier redirectTo={redirectTo} />
						) : (
							<InlineLogin redirectTo={redirectTo} formError={data.formError} />
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
