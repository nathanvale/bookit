import * as React from 'react'
import { type FieldConfig } from '@conform-to/react'
import { type FormItem } from './form-item.tsx'

export type FormFieldProps = {
	config: FieldConfig<any>
	children: React.ReactElement<typeof FormItem>
}

export type FormFieldContextValue = {
	config: FieldConfig<any>
}

export const FormFieldContext = React.createContext<FormFieldContextValue>(
	{} as FormFieldContextValue,
)

export const FormField: React.FC<FormFieldProps> = ({ config, children }) => {
	return (
		<FormFieldContext.Provider value={{ config }}>
			{children}
		</FormFieldContext.Provider>
	)
}
FormField.displayName = 'FormField'
