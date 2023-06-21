import React from 'react'
import { conform, parse, useForm } from '@conform-to/react'
import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { Input } from '~/components/ui/input.tsx'
import { FormField } from '~/components/form/form-field.tsx'
import { FormItem } from '~/components/form/form-item.tsx'
import { FormLabel } from '~/components/form/form-label.tsx'
import { FormControl } from '~/components/form/form-control.tsx'
import { FormDescription } from '~/components/form/form-description.tsx'
import { FormMessage } from '~/components/form/form-message.tsx'

import { TextField } from '~/components/form/text-field.tsx'

interface SignupForm {
	email: string
	password: string
	confirmPassword: string
}

function parseFormData(formData: FormData) {
	return parse<SignupForm>(formData, {
		resolve({ email, password, confirmPassword }) {
			const error: Record<string, string> = {}

			if (!email) {
				error.email = 'Email is required'
			} else if (!email.includes('@')) {
				error.email = 'Email is invalid'
			}

			if (!password) {
				error.password = 'Password is required'
			}

			if (!confirmPassword) {
				error.confirmPassword = 'Confirm password is required'
			} else if (confirmPassword !== password) {
				error.confirmPassword = 'Password does not match'
			}

			if (error.email || error.password || error.confirmPassword) {
				return { error }
			}

			// Return the value only if no error
			return {
				value: {
					email,
					password,
					confirmPassword,
				},
			}
		},
	})
}

export async function action({ request }: ActionArgs) {
	const formData = await request.formData()
	const submission = parseFormData(formData)

	/**
	 * Signup only when the user click on the submit button and no error found
	 */
	if (!submission.value || submission.intent !== 'submit') {
		// Always sends the submission state back to client until the user is signed up
		return json({
			...submission,
			payload: {
				// Never send the password back to client
				email: submission.payload.email,
			},
		})
	}

	throw new Error('Not implemented')
}

export default function Signup() {
	// Last submission returned by the server
	const lastSubmission = useActionData<typeof action>()
	const [form, { email, password, confirmPassword }] = useForm({
		// Sync the result of last submission
		lastSubmission,

		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseFormData(formData)
		},
	})

	return (
		<Form method="post" {...form.props}>
			<TextField
				label="Email"
				message="This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days."
				placeholder="Password"
				config={password}
			/>
			<TextField
				label="Password"
				placeholder="Password"
				type="password"
				config={password}
			/>
			<TextField
				label="Confirm password"
				message="Shh!!"
				placeholder="Confirm password"
				type="password"
				config={confirmPassword}
			/>
			<button type="submit">Signup</button>
		</Form>
	)
}
