import { useSubmit, Form, Link, useMatches } from '@remix-run/react'
import { getUserImgSrc, useIsAuthRoute } from '~/utils/misc.ts'
import { useUser } from '~/utils/user.ts'
import { ButtonLink } from './ui/button-link.tsx'
import { ThemeSwitch } from '~/routes/resources+/theme/index.tsx'
import { useRef } from 'react'
import { Button } from '~/components/ui/button.tsx'
import { SearchBar } from '~/components/search-bar.tsx'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu.tsx'

import { Icon } from './ui/icon.tsx'
export interface SiteHeaderProps {
	user?: {
		id: string
		name: string | null
		username: string
		imageId: string | null
	} | null
}

export function SiteHeader({ user }: SiteHeaderProps) {
	const matches = useMatches()
	const isOnSearchPage = matches.find(m => m.id === 'routes/users+/index')
	const { isAuthRoute } = useIsAuthRoute()
	if (isAuthRoute) return null
	return (
		<header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
			<div className="container flex h-14 items-center">
				<ButtonLink to="/" size="sm" variant="default">
					<span>
						<span className="font-light">epic</span>{' '}
						<span className="font-bold">notes</span>
					</span>
				</ButtonLink>
				<div>MainNav</div>
				<div>MobileNav</div>
				<div className="flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end">
					<div className="w-full flex-1 md:w-auto md:flex-none"></div>
					<nav className="flex items-center space-x-1">
						{isOnSearchPage ? null : (
							<div className="ml-auto max-w-sm flex-1 pr-10">
								<SearchBar status="idle" />
							</div>
						)}
						<ThemeSwitch />
						{user ? (
							<UserDropdown />
						) : (
							<ButtonLink to="/login" size="sm" variant="default">
								Log In
							</ButtonLink>
						)}
					</nav>
				</div>
			</div>
		</header>
	)
}

function UserDropdown() {
	const user = useUser()
	const submit = useSubmit()
	const formRef = useRef<HTMLFormElement>(null)
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button asChild variant="secondary">
					<Link
						to={`/users/${user.username}`}
						// this is for progressive enhancement
						onClick={e => e.preventDefault()}
						className="flex items-center gap-2"
					>
						<img
							className="h-8 w-8 rounded-full object-cover"
							alt={user.name ?? user.username}
							src={getUserImgSrc(user.imageId)}
						/>
						<span className="text-body-sm font-bold">
							{user.name ?? user.username}
						</span>
					</Link>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent sideOffset={8} align="start">
					<DropdownMenuItem asChild>
						<Link prefetch="intent" to={`/users/${user.username}`}>
							<Icon className="text-body-md" name="avatar">
								Profile
							</Icon>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link prefetch="intent" to={`/users/${user.username}/notes`}>
							<Icon className="text-body-md" name="pencil-2">
								Notes
							</Icon>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild
						// this prevents the menu from closing before the form submission is completed
						onSelect={event => {
							event.preventDefault()
							submit(formRef.current)
						}}
					>
						<Form action="/logout" method="POST" ref={formRef}>
							<Icon className="text-body-md" name="exit">
								<button type="submit">Logout</button>
							</Icon>
						</Form>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	)
}
