import * as React from 'react'
import { cn } from '~/utils/misc.ts'
import { useFormField } from './form-field.tsx'

export const FormMessage = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
	const {
		field: { error, errorId, descriptionId },
	} = useFormField()
	const body = error ? String(error) : children

	if (!body) {
		return null
	}

	return (
		<p
			ref={ref}
			id={error ? errorId : descriptionId}
			className={cn(
				'text-xs font-normal text-muted-foreground',
				className,
				error && 'text-destructive',
			)}
			{...props}
		>
			{body}
		</p>
	)
})
FormMessage.displayName = 'FormMessage'
