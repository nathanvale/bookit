import * as React from 'react'
import type * as LabelPrimitive from '@radix-ui/react-label'
import { Label } from '~/components/ui/label.tsx'
import { cn } from '~/utils/misc.ts'
import { useFormField } from './form-field.tsx'

export const FormLabel = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
	const {
		field: { error, id },
	} = useFormField()
	return (
		<Label
			ref={ref}
			className={cn(error && 'text-destructive', className)}
			htmlFor={id}
			{...props}
		/>
	)
})
FormLabel.displayName = 'FormLabel'
