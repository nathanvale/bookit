import { siteConfig } from '~/config/site.ts'
import { useIsAuthRoute } from '~/utils/misc.ts'

export function SiteFooter() {
	const { isAuthRoute } = useIsAuthRoute()
	if (isAuthRoute) return null
	return (
		<footer className="py-6 md:px-8 md:py-0">
			<div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
				<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
					Built by{' '}
					<a
						href={siteConfig.links.linkedin}
						target="_blank"
						rel="noreferrer"
						className="font-medium underline underline-offset-4"
					>
						Nathan Vale
					</a>
					. The source code is available on{' '}
					<a
						href={siteConfig.links.github}
						target="_blank"
						rel="noreferrer"
						className="font-medium underline underline-offset-4"
					>
						GitHub
					</a>
					.
				</p>
			</div>
		</footer>
	)
}
