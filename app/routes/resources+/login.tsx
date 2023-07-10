import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { json, redirect, type DataFunctionArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { AuthorizationError } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { safeRedirect } from 'remix-utils'
import { z } from 'zod'
import { ErrorList } from '~/components/forms.tsx'
import { authenticator } from '~/utils/auth.server.ts'
import { prisma } from '~/utils/db.server.ts'
import { cn, invariantResponse } from '~/utils/misc.ts'
import { commitSession, getSession } from '~/utils/session.server.ts'
import { passwordSchema, usernameSchema } from '~/utils/user-validation.ts'
import { checkboxSchema } from '~/utils/zod-extensions.ts'
import { twoFAVerificationType } from '../settings+/profile.two-factor.tsx'
import { unverifiedSessionKey } from './verify.tsx'
import { Icons } from '~/components/icons.tsx'
import { Button } from '~/components/ui/button.tsx'
import { Input } from '~/components/ui/input.tsx'
import { FormField } from '~/components/form/form-field.tsx'
import { FormControl } from '~/components/form/form-control.tsx'
import { FormItem } from '~/components/form/form-item.tsx'
import { FormLabel } from '~/components/form/form-label.tsx'
import { FormMessage } from '~/components/form/form-message.tsx'

import React from 'react'
import { FormCheckbox } from '~/components/form/form-check-box.tsx'
import { Link } from '~/components/ui/link.tsx'

const ROUTE_PATH = '/resources/login'

export const loginFormSchema = z.object({
	username: usernameSchema,
	password: passwordSchema,
	redirectTo: z.string().optional(),
	remember: checkboxSchema(),
})

export async function action({ request }: DataFunctionArgs) {
	const formData = await request.formData()
	const submission = parse(formData, {
		schema: loginFormSchema,
		acceptMultipleErrors: () => true,
	})
	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}
	if (!submission.value) {
		return json(
			{
				status: 'error',
				submission,
			} as const,
			{ status: 400 },
		)
	}

	let sessionId: string | null = null
	try {
		sessionId = await authenticator.authenticate(FormStrategy.name, request, {
			throwOnError: true,
			context: { formData },
		})
	} catch (error) {
		if (error instanceof AuthorizationError) {
			return json(
				{
					status: 'error',
					submission: {
						...submission,
						error: {
							// show authorization error as a form level error message.
							'': error.message,
						},
					},
				} as const,
				{ status: 400 },
			)
		}
		throw error
	}

	const session = await prisma.session.findUnique({
		where: { id: sessionId },
		select: { userId: true, expirationDate: true },
	})
	invariantResponse(session, 'newly created session not found')

	const user2FA = await prisma.verification.findFirst({
		where: { type: twoFAVerificationType, target: session.userId },
		select: { id: true },
	})

	const cookieSession = await getSession(request.headers.get('cookie'))
	const keyToSet = user2FA ? unverifiedSessionKey : authenticator.sessionKey
	cookieSession.set(keyToSet, sessionId)
	const { remember, redirectTo } = submission.value
	const responseInit = {
		headers: {
			'Set-Cookie': await commitSession(cookieSession, {
				expires: remember ? session.expirationDate : undefined,
			}),
		},
	}
	if (user2FA || !redirectTo) {
		return json({ status: 'success', submission } as const, responseInit)
	} else {
		throw redirect(safeRedirect(redirectTo), responseInit)
	}
}

export interface InlineLoginProps extends React.HTMLAttributes<HTMLDivElement> {
	redirectTo?: string
	formError?: string | null
}

export function InlineLogin({
	className,
	redirectTo,
	formError,
	...props
}: InlineLoginProps) {
	const loginFetcher = useFetcher<typeof action>()

	const [form, fields] = useForm({
		id: 'inline-login',
		defaultValue: { redirectTo },
		constraint: getFieldsetConstraint(loginFormSchema),
		lastSubmission: loginFetcher.data?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: loginFormSchema })
		},
		shouldRevalidate: 'onBlur',
	})
	const isLoading = loginFetcher.state !== 'idle'

	return (
		<div>
			<div className={cn('grid gap-6', className)} {...props}>
				<loginFetcher.Form
					method="POST"
					action={ROUTE_PATH}
					name="login"
					{...form.props}
				>
					<div className="grid gap-6">
						<div className="grid gap-2">
							<FormField field={fields.username}>
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											autoCapitalize="none"
											autoComplete="username"
											autoCorrect="off"
											autoFocus
											className="lowercase"
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage> This is your public display name</FormMessage>
								</FormItem>
							</FormField>
							<FormField field={fields.password}>
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											autoComplete="current-password"
											type="password"
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>
							<FormField field={fields.remember}>
								<FormItem>
									<div className="flex items-center justify-between">
										<div className="flex items-center justify-between space-x-2">
											<FormControl>
												<FormCheckbox />
											</FormControl>
											<FormLabel>Remember me</FormLabel>
										</div>
										<Link className="text-sm" to="/forgot-password">
											Forgot password?
										</Link>
									</div>
									<FormMessage />
								</FormItem>
							</FormField>
						</div>
						<Button type="submit" disabled={isLoading}>
							{isLoading && (
								<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
							)}
							Log In with Username
						</Button>
						<input {...conform.input(fields.redirectTo)} type="hidden" />
						<ErrorList
							title="Login Error"
							errors={[...form.errors, formError]}
							id={form.errorId}
						/>
					</div>
				</loginFetcher.Form>
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							Or continue with
						</span>
					</div>
				</div>
				<Button variant="outline" type="button" disabled={isLoading}>
					{isLoading ? (
						<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<Icons.gitHub className="mr-2 h-4 w-4" />
					)}{' '}
					Github
				</Button>
				<div className="flex items-center justify-center space-x-2 text-sm">
					<span className="text-night-200">New here?</span>
					<Link to="/signup">Create an account</Link>
				</div>
			</div>
		</div>
	)
}
