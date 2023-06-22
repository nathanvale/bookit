import { Link, LinkProps } from '@remix-run/react'
import { Button, buttonVariants } from './button.tsx'
import * as React from 'react'
import { VariantProps } from 'class-variance-authority'

export interface ButtonLinkProps
	extends LinkProps,
		VariantProps<typeof buttonVariants> {}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
	({ className, variant, size, to, ...props }, ref) => {
		return (
			<Button className={className} variant={variant} size={size} asChild>
				<Link ref={ref} to={to} {...props} />
			</Button>
		)
	},
)
ButtonLink.displayName = 'ButtonLink'

export { ButtonLink }
