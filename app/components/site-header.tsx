import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useSubmit, Form, Link } from '@remix-run/react'
import { useRef } from 'react'
import { getUserImgSrc } from '~/utils/misc.ts'
import { useUser } from '~/utils/user.ts'
import { ButtonLink } from './ui/button-link.tsx'

export interface SiteHeaderProps {
	user?: {
		id: string
		name: string | null
		username: string
		imageId: string | null
	} | null
}

export function SiteHeader({ user }: SiteHeaderProps) {
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
					<div className="w-full flex-1 md:w-auto md:flex-none">
						<div>CommandMenu</div>
					</div>
					<nav className="flex items-center space-x-1">
						{user ? (
							<UserDropdown />
						) : (
							<ButtonLink to="/login" size="sm" variant="default">
								Log In
							</ButtonLink>
						)}

						<div>ModeToggle</div>
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
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<Link
					to={`/users/${user.username}`}
					// this is for progressive enhancement
					onClick={e => e.preventDefault()}
					className="bg-brand-500 hover:bg-brand-400 focus:bg-brand-400 radix-state-open:bg-brand-400 flex items-center gap-2 rounded-full py-2 pl-2 pr-4 outline-none"
				>
					<img
						className="h-8 w-8 rounded-full object-cover"
						alt={user.name ?? user.username}
						src={getUserImgSrc(user.imageId)}
					/>
					<span className="text-body-sm font-bold text-white">
						{user.name ?? user.username}
					</span>
				</Link>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					sideOffset={8}
					align="start"
					className="flex flex-col rounded-3xl bg-[#323232]"
				>
					<DropdownMenu.Item asChild>
						<Link
							prefetch="intent"
							to={`/users/${user.username}`}
							className="hover:bg-brand-500 radix-highlighted:bg-brand-500 rounded-t-3xl px-7 py-5 outline-none"
						>
							Profile
						</Link>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<Link
							prefetch="intent"
							to={`/users/${user.username}/notes`}
							className="hover:bg-brand-500 radix-highlighted:bg-brand-500 px-7 py-5 outline-none"
						>
							Notes
						</Link>
					</DropdownMenu.Item>
					<DropdownMenu.Item
						asChild
						// this prevents the menu from closing before the form submission is completed
						onSelect={event => {
							event.preventDefault()
							submit(formRef.current)
						}}
					>
						<Form
							action="/logout"
							method="POST"
							className="radix-highlighted:bg-brand-500 rounded-b-3xl outline-none"
							ref={formRef}
						>
							<button type="submit" className="px-7 py-5">
								Logout
							</button>
						</Form>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}
