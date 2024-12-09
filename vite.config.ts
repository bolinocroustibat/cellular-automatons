import { defineConfig } from "vite"

export default defineConfig({
	base: "",
	define: {
		APP_VERSION: JSON.stringify(process.env.npm_package_version),
	},
})
