import { type MutableRefObject, type RefCallback } from 'react'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useLocation } from '@remix-run/react'

export function getUserImgSrc(imageId?: string | null) {
	return imageId ? `/resources/file/${imageId}` : `/img/user.png`
}

export function getErrorMessage(error: unknown) {
	if (typeof error === 'string') return error
	if (
		error &&
		typeof error === 'object' &&
		'message' in error &&
		typeof error.message === 'string'
	) {
		return error.message
	}
	console.error('Unable to get error message for error', error)
	return 'Unknown Error'
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function convertToCapitalCase(input: string) {
	const words = input.toLowerCase().split('_')
	let result = ''

	for (let i = 0; i < words.length; i++) {
		result += words[i].charAt(0).toUpperCase() + words[i].slice(1)
	}

	return result
}

type MutableRefList<T> = Array<
	RefCallback<T> | MutableRefObject<T> | undefined | null
>

export function mergeRefs<T>(...refs: MutableRefList<T>): RefCallback<T> {
	return (val: T) => {
		setRef(val, ...refs)
	}
}

export function setRef<T>(val: T, ...refs: MutableRefList<T>): void {
	refs.forEach(ref => {
		if (typeof ref === 'function') {
			ref(val)
		} else if (ref != null) {
			ref.current = val
		}
	})
}

export function useIsAuthRoute() {
	const location = useLocation()
	return {
		isAuthRoute:
			location.pathname === '/login' || location.pathname === '/login',
	}
}
