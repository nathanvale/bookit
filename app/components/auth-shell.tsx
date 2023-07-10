import { ThemeSwitch } from '~/routes/resources+/theme/index.tsx'

export interface AuthShellProps {
	children: React.ReactNode
	title: string
}

export function AuthShell({ children, title }: AuthShellProps) {
	return (
		<div className="relative flex h-screen w-screen items-center justify-center">
			<div className="flex w-full md:w-auto lg:max-w-7xl">
				<div className="container relative flex h-screen flex-col pt-32 sm:grid md:items-center md:justify-center md:px-32 md:pt-0 md:shadow-lg lg:h-[800px] lg:grid-cols-2 lg:px-0">
					<ThemeSwitch className="absolute right-4 top-4 md:right-8 md:top-8" />
					<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
						<div className="absolute inset-0 bg-surface-02dp" />
						<div className="relative z-20 flex items-center text-lg font-medium">
							Bookit
						</div>
						<div className="relative z-20 mt-auto">
							<blockquote className="space-y-2">
								<p className="text-lg">
									The bookit app is amazing, it has completely changed my
									business!
								</p>
								<footer className="text-sm">Nathan Vale</footer>
							</blockquote>
						</div>
					</div>
					<div className="w-full lg:p-8">
						<div className="mx-auto flex w-full flex-col justify-center space-y-9 sm:w-[350px]">
							<div className="mb-2 flex flex-col space-y-2 text-center md:mb-4">
								<h1 className="text-4xl font-black tracking-tight">{title}</h1>
							</div>
							{children}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
