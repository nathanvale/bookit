import chroma from 'chroma-js'
/**
 * This script creates the surfaces for the dark theme.
 * //https://m2.material.io/design/color/dark-theme.html#properties
 */

// This is the fixed material design black color
const baseColor = '#121212'
const color = '#BB86FC' // Replace with your desired color, typicall the dark theme primary color

const opacities = {
	DEFAULT: 'hsl(var(--background))',
	'01dp': 0.05,
	'02dp': 0.07,
	'03dp': 0.08,
	'04dp': 0.09,
	'06dp': 0.11,
	'08dp': 0.12,
	'12dp': 0.14,
	'16dp': 0.15,
	'24dp': 0.24,
} as Record<string, string | number>

Object.keys(opacities).forEach(key => {
	if (key === 'DEFAULT') return
	const opacity = opacities[key as keyof typeof opacities]
	const mixedColor = chroma.mix(baseColor, color, opacity, 'rgb')
	opacities[key as keyof typeof opacities] = mixedColor.hex()
	return { [key]: mixedColor.hex() }
})
// Paste the output into tailwind.config.ts
console.log(opacities)
