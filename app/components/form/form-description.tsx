import * as React from 'react'
import { cn } from '~/utils/misc.ts'
import { useFormField } from './form-field.tsx'

export const FormDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
	const {
		field: { descriptionId },
	} = useFormField()

	return (
		<p
			ref={ref}
			id={descriptionId}
			className={cn('text-sm text-muted-foreground', className)}
			{...props}
		/>
	)
})
FormDescription.displayName = 'FormDescription'
