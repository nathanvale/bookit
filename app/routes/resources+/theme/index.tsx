import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { json, redirect, type DataFunctionArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import * as React from 'react'
import { safeRedirect } from 'remix-utils'
import { z } from 'zod'
import { useHints } from '~/utils/client-hints.tsx'
import { ErrorList } from '~/components/forms.tsx'
import { useRequestInfo } from '~/utils/request-info.ts'
import {
	commitSession,
	deleteTheme,
	getSession,
	setTheme,
} from './theme-session.server.ts'
import { Button } from '~/components/ui/button.tsx'
import { Icons } from '~/components/icons.tsx'

const ROUTE_PATH = '/resources/theme'

const ThemeFormSchema = z.object({
	redirectTo: z.string().optional(),
	theme: z.enum(['system', 'light', 'dark']),
})

export async function action({ request }: DataFunctionArgs) {
	const formData = await request.formData()
	const submission = parse(formData, {
		schema: ThemeFormSchema,
		acceptMultipleErrors: () => true,
	})
	if (!submission.value) {
		return json(
			{
				status: 'error',
				submission,
			} as const,
			{ status: 400 },
		)
	}
	if (submission.intent !== 'submit') {
		return json({ status: 'success', submission } as const)
	}
	const session = await getSession(request.headers.get('cookie'))
	const { redirectTo, theme } = submission.value
	if (theme === 'system') {
		deleteTheme(session)
	} else {
		setTheme(session, theme)
	}

	const responseInit = {
		headers: { 'Set-Cookie': await commitSession(session) },
	}
	if (redirectTo) {
		return redirect(safeRedirect(redirectTo), responseInit)
	} else {
		return json({ success: true }, responseInit)
	}
}
export interface ThemeSwitchProps {
	className?: string
}
export function ThemeSwitch({ className }: ThemeSwitchProps) {
	const {
		path,
		session: { theme },
	} = useRequestInfo()
	const fetcher = useFetcher()
	const [isHydrated, setIsHydrated] = React.useState(false)

	React.useEffect(() => {
		setIsHydrated(true)
	}, [])

	const [form] = useForm({
		id: 'theme-switch',
		lastSubmission: fetcher.data?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: ThemeFormSchema })
		},
	})

	const mode = theme ?? 'system'
	const nextMode =
		mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system'
	const modeLabel = {
		light: (
			<>
				<Icons.sun />
				<span className="sr-only">Light theme</span>
			</>
		),
		dark: (
			<>
				<Icons.moon />
				<span className="sr-only">Dark theme</span>
			</>
		),
		system: (
			<>
				<Icons.laptop />
				<span className="sr-only">System theme</span>
			</>
		),
	}

	return (
		<fetcher.Form
			method="POST"
			className={className}
			action={ROUTE_PATH}
			{...form.props}
		>
			{/*
					this is for progressive enhancement so we redirect them to the page
					they are on if the JavaScript hasn't had a chance to hydrate yet.
				*/}
			{isHydrated ? null : (
				<input type="hidden" name="redirectTo" value={path} />
			)}
			<input type="hidden" name="theme" value={nextMode} />
			<Button variant="ghost" size="sm" className="w-9 px-0">
				{modeLabel[mode]}
			</Button>
			<ErrorList errors={form.errors} id={form.errorId} />
		</fetcher.Form>
	)
}

/**
 * @returns the user's theme preference, or the client hint theme if the user
 * has not set a preference.
 */
export function useTheme() {
	const hints = useHints()
	const requestInfo = useRequestInfo()
	return requestInfo.session.theme ?? hints.theme
}
