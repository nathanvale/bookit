import { Link } from '@remix-run/react'
import React, { useId, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { useInputEvent } from '@conform-to/react'
import { Checkbox } from '~/components/ui/checkbox.tsx'
import { Button as ButtonShadCn } from '~/components/ui/button.tsx'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert.tsx'
import { AlertCircle } from 'lucide-react'
export type ListOfErrors = Array<string | null | undefined> | null | undefined

export function ErrorList({
	id,
	errors,
	title = 'Error',
}: {
	errors?: ListOfErrors
	id?: string
	title?: string
}) {
	const errorsToRender = errors?.filter(Boolean)
	if (!errorsToRender?.length) return null
	return (
		<Alert variant="destructive">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>
				<ul id={id} className="space-y-2">
					{errorsToRender.map(e => (
						<li key={e} className="text-sm font-medium text-destructive">
							{e}
						</li>
					))}
				</ul>
			</AlertDescription>
		</Alert>
	)
}

export function Field({
	labelProps,
	inputProps,
	errors,
	className,
}: {
	labelProps: Omit<JSX.IntrinsicElements['label'], 'className'>
	inputProps: Omit<JSX.IntrinsicElements['input'], 'className'>
	errors?: ListOfErrors
	className?: string
}) {
	const fallbackId = useId()
	const id = inputProps.id ?? fallbackId
	const errorId = errors?.length ? `${id}-error` : undefined
	return (
		<div className={className}>
			<input
				id={id}
				aria-invalid={errorId ? true : undefined}
				aria-describedby={errorId}
				placeholder=" "
				{...inputProps}
				className="border-night-400 bg-night-700 text-body-xs focus:border-brand-primary disabled:bg-night-400 h-16 w-full rounded-lg border px-4 pt-4 caret-white outline-none"
			/>
			{/* the label comes after the input so we can use the sibling selector in the CSS to give us animated label control in CSS only */}
			<label htmlFor={id} {...labelProps} />
			<div className="px-4 pb-3 pt-1">
				{errorId ? <ErrorList id={errorId} errors={errors} /> : null}
			</div>
		</div>
	)
}

export function TextareaField({
	labelProps,
	textareaProps,
	errors,
	className,
}: {
	labelProps: Omit<JSX.IntrinsicElements['label'], 'className'>
	textareaProps: Omit<JSX.IntrinsicElements['textarea'], 'className'>
	errors?: ListOfErrors
	className?: string
}) {
	const fallbackId = useId()
	const id = textareaProps.id ?? textareaProps.name ?? fallbackId
	const errorId = errors?.length ? `${id}-error` : undefined
	return (
		<div className={className}>
			<textarea
				id={id}
				aria-invalid={errorId ? true : undefined}
				aria-describedby={errorId}
				placeholder=" "
				{...textareaProps}
				className="border-night-400 bg-night-700 text-body-xs focus:border-brand-primary disabled:bg-night-400 h-48 w-full rounded-lg border px-4 pt-8 caret-white outline-none"
			/>
			{/* the label comes after the input so we can use the sibling selector in the CSS to give us animated label control in CSS only */}
			<label htmlFor={id} {...labelProps} />
			<div className="px-4 pb-3 pt-1">
				{errorId ? <ErrorList id={errorId} errors={errors} /> : null}
			</div>
		</div>
	)
}

export function CheckboxField({
	labelProps,
	buttonProps,
	errors,
}: {
	labelProps: Omit<JSX.IntrinsicElements['label'], 'className'>
	buttonProps: Omit<
		React.ComponentPropsWithoutRef<typeof Checkbox>,
		'type' | 'className'
	> & {
		type?: string
	}
	errors?: ListOfErrors
}) {
	const fallbackId = useId()
	const buttonRef = useRef<HTMLButtonElement>(null)
	// To emulate native events that Conform listen to:
	// See https://conform.guide/integrations
	const control = useInputEvent({
		// Retrieve the checkbox element by name instead as Radix does not expose the internal checkbox element
		// See https://github.com/radix-ui/primitives/discussions/874
		ref: () =>
			buttonRef.current?.form?.elements.namedItem(buttonProps.name ?? ''),
		onFocus: () => buttonRef.current?.focus(),
	})
	const id = buttonProps.id ?? buttonProps.name ?? fallbackId
	const errorId = errors?.length ? `${id}-error` : undefined
	return (
		<div>
			<div className="flex gap-2">
				<Checkbox
					id={id}
					ref={buttonRef}
					aria-invalid={errorId ? true : undefined}
					aria-describedby={errorId}
					{...buttonProps}
					onCheckedChange={state => {
						control.change(Boolean(state.valueOf()))
						buttonProps.onCheckedChange?.(state)
					}}
					onFocus={event => {
						control.focus()
						buttonProps.onFocus?.(event)
					}}
					onBlur={event => {
						control.blur()
						buttonProps.onBlur?.(event)
					}}
					type="button"
				>
					{/* <Checkbox.Indicator className="h-4 w-4">
						<svg viewBox="0 0 8 8">
							<path
								d="M1,4 L3,6 L7,2"
								stroke="black"
								strokeWidth="1"
								fill="none"
							/>
						</svg>
					</Checkbox.Indicator> */}
				</Checkbox>
				<label
					htmlFor={id}
					{...labelProps}
					className="text-body-xs text-night-200 self-center"
				/>
			</div>
			<div className="px-4 pb-3 pt-1">
				{errorId ? <ErrorList id={errorId} errors={errors} /> : null}
			</div>
		</div>
	)
}

export function getButtonClassName({
	size,
	variant,
}: {
	size: 'xs' | 'sm' | 'md' | 'md-wide' | 'pill'
	variant: 'primary' | 'secondary'
}) {
	const baseClassName =
		'flex justify-center items-center rounded-full font-bold outline-none transition-[background-color,color] duration-200 disabled:bg-night-500 disabled:text-night-200'
	const primaryClassName =
		'bg-brand-primary hover:bg-brand-secondary hover:text-night-700 focus:bg-brand-secondary focus:text-night-700 active:bg-brand-secondary-muted'
	const secondaryClassName =
		'border-[1.5px] border-night-400 bg-night-700 hover:border-brand-primary focus:border-brand-primary active:border-brand-primary-muted'
	const extraSmallClassName = 'py-2 px-3 text-body-xs'
	const smallClassName = 'px-10 py-[14px] text-body-xs'
	const mediumClassName = 'px-14 py-5 text-lg'
	const mediumWideClassName = 'px-24 py-5 text-lg'
	const pillClassName = 'px-12 py-3 leading-3'
	const className = twMerge(
		baseClassName,
		variant === 'primary' && primaryClassName,
		variant === 'secondary' && secondaryClassName,
		size === 'xs' && extraSmallClassName,
		size === 'sm' && smallClassName,
		size === 'md' && mediumClassName,
		size === 'md-wide' && [mediumWideClassName],
		size === 'pill' && pillClassName,
	)
	return className
}

export function Button({
	size,
	variant,
	status = 'idle',
	...props
}: React.ComponentPropsWithoutRef<'button'> &
	Parameters<typeof getButtonClassName>[0] & {
		status?: 'pending' | 'success' | 'error' | 'idle'
	}) {
	const companion = {
		pending: <span className="inline-block animate-spin">🌀</span>,
		success: <span>✅</span>,
		error: <span>❌</span>,
		idle: null,
	}[status]
	return (
		<ButtonShadCn size="sm" {...props}>
			<div>{props.children}</div>
			{companion}
		</ButtonShadCn>
	)
}

export function ButtonLink({
	size,
	variant,
	...props
}: React.ComponentPropsWithoutRef<typeof Link> &
	Parameters<typeof getButtonClassName>[0]) {
	return (
		// eslint-disable-next-line jsx-a11y/anchor-has-content
		<Link
			{...props}
			className={twMerge(
				getButtonClassName({ size, variant }),
				props.className,
			)}
		/>
	)
}

export function LabelButton({
	size,
	variant,
	...props
}: Omit<React.ComponentPropsWithoutRef<'label'>, 'className'> &
	Parameters<typeof getButtonClassName>[0]) {
	return (
		<label
			{...props}
			className={twMerge(
				getButtonClassName({ size, variant }),
				'cursor-pointer',
			)}
		/>
	)
}
