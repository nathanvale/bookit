import * as React from 'react'
import { type FieldConfig } from '@conform-to/react'
import { type FormItem } from './form-item.tsx'

export type FormFieldProps = {
	children: React.ReactElement<typeof FormItem>
	field: FieldConfig<any>
}

export type FormFieldContextValue = {
	field: FieldConfig<any>
}

export const FormFieldContext = React.createContext<FormFieldContextValue>(
	{} as FormFieldContextValue,
)

export const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext)
	if (!fieldContext) {
		throw new Error('useFormField should be used within <FormField>')
	}
	return fieldContext
}

export const FormField: React.FC<FormFieldProps> = ({ children, field }) => {
	return (
		<FormFieldContext.Provider value={{ field }}>
			{children}
		</FormFieldContext.Provider>
	)
}
FormField.displayName = 'FormField'
