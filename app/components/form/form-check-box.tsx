import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { useFormField } from './form-field.tsx'
import { Checkbox } from '~/components/ui/checkbox.tsx'
import { useInputEvent } from '@conform-to/react'
import { mergeRefs } from '~/utils/misc.ts'

const FormCheckbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
	const {
		field: { name },
	} = useFormField()

	//console.log('buttonProps', buttonProps)
	const buttonRef = React.useRef<HTMLButtonElement>(null)
	// To emulate native events that Conform listen to:
	// See https://conform.guide/integrations
	const { blur, change, focus } = useInputEvent({
		// Retrieve the checkbox element by name instead as Radix does not expose the internal checkbox element
		// See https://github.com/radix-ui/primitives/discussions/874
		ref: () => {
			return buttonRef.current?.form?.elements.namedItem(name ?? '')
		},
		onFocus: () => {
			return buttonRef.current?.focus()
		},
		onBlur: () => {
			return buttonRef.current?.blur()
		},
	})
	return (
		<Checkbox
			ref={mergeRefs(ref, buttonRef)}
			{...props}
			onCheckedChange={function (state) {
				change(Boolean(state.valueOf()))
				props.onCheckedChange?.(state)
			}}
			onFocus={event => {
				focus()
				props.onFocus?.(event)
			}}
			onBlur={event => {
				blur()
				props.onBlur?.(event)
			}}
			type="button"
		/>
	)
})
FormCheckbox.displayName = CheckboxPrimitive.Root.displayName

export { FormCheckbox }
