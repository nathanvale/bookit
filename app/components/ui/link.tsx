import {
	Link as RemixLink,
	type LinkProps as RemixLinkProps,
} from '@remix-run/react'
import * as React from 'react'
import { cn } from '~/utils/misc.ts'

export interface LinkProps extends RemixLinkProps {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
	({ className, ...props }, ref) => {
		return (
			<RemixLink
				ref={ref}
				className={cn(
					'underline-offset-4 hover:text-primary hover:underline',
					className,
				)}
				{...props}
			/>
		)
	},
)
Link.displayName = 'LinkProps'

export { Link }
