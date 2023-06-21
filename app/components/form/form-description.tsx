import * as React from 'react'
import { useFormField } from './form-label.tsx'
import { cn } from '~/utils/misc.ts'

export const FormDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
	const { formDescriptionId } = useFormField()

	return (
		<p
			ref={ref}
			id={formDescriptionId}
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	)
})
FormDescription.displayName = 'FormDescription'
