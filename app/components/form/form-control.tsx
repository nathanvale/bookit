import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'
import { useFormField } from './form-field.tsx'
export const FormControl = React.forwardRef<
	React.ElementRef<typeof Slot>,
	React.InputHTMLAttributes<HTMLInputElement>
>(({ ...props }, ref) => {
	const { field } = useFormField()
	const control: React.InputHTMLAttributes<HTMLInputElement> = {}
	control.id = field.id
	control.name = field.name
	control.form = field.form
	control.defaultValue = field.defaultValue
	control.autoFocus =
		field.initialError && Object.entries(field.initialError).length > 0
	control.required = field.required
	control.minLength = field.minLength
	control.maxLength = field.maxLength
	control.min = field.min
	control.max = field.max
	control.multiple = field.multiple
	control.pattern = field.pattern
	control['aria-invalid'] = field.error ? true : undefined
	control['aria-describedby'] = field.error
		? field.errorId
		: field.descriptionId
	return <Slot ref={ref} {...props} {...control} />
})
FormControl.displayName = 'FormControl'
