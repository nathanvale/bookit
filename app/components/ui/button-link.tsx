/* eslint-disable jsx-a11y/anchor-has-content */
import { Link, type LinkProps } from '@remix-run/react'
import { Button, type buttonVariants } from './button.tsx'
import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'

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
