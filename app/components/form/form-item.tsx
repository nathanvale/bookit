import * as React from 'react'
import { cn } from '~/utils/misc.ts'

export const FormItem = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	return <div ref={ref} className={cn('space-y-2', className)} {...props} />
})
FormItem.displayName = 'FormItem'
