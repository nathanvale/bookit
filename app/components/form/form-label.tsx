import * as React from 'react'
import type * as LabelPrimitive from '@radix-ui/react-label'
import { Label } from '~/components/ui/label.tsx'
import { cn } from '~/utils/misc.ts'
import { FormFieldContext } from './form-field.tsx'
import { FormItemContext } from './form-item.tsx'

export const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext)
	const itemContext = React.useContext(FormItemContext)

	if (!fieldContext) {
		throw new Error('useFormField should be used within <FormField>')
	}

	const {
		config: { error },
	} = fieldContext
	const { id } = itemContext

	return {
		id,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		error,
	}
}

export const FormLabel = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
	const { error, formItemId } = useFormField()

	return (
		<Label
			ref={ref}
			className={cn(error && 'text-destructive', className)}
			htmlFor={formItemId}
			{...props}
		/>
	)
})
FormLabel.displayName = 'FormLabel'
