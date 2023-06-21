import { conform, type FieldConfig } from '@conform-to/react'
import React from 'react'
import { FormField } from './form-field.tsx'
import { Input, type InputProps } from '../ui/input.tsx'
import { FormControl } from './form-control.tsx'
import { FormDescription } from './form-description.tsx'
import { FormItem } from './form-item.tsx'
import { FormLabel } from './form-label.tsx'
import { FormMessage } from './form-message.tsx'

export const TextField = React.forwardRef<
	HTMLInputElement,
	InputProps & {
		label: string
		message?: string
		config: FieldConfig<any>
	}
>((props, ref) => {
	const { label, message, config } = props
	return (
		<FormField config={config}>
			<FormItem>
				<FormLabel>{label}</FormLabel>
				<FormControl>
					<Input ref={ref} {...(conform.input(config), { ...props })} />
				</FormControl>
				{message ? <FormDescription>{message}</FormDescription> : null}
				<FormMessage />
			</FormItem>
		</FormField>
	)
})
TextField.displayName = 'TextField'
