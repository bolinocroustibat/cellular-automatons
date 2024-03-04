// vite.config.js
import { defineConfig } from "vite"

export default defineConfig({
	base: "", // empty string = relative path (https://stackoverflow.com/questions/69744253/vite-build-always-using-static-paths)
	define: {
		APP_VERSION: JSON.stringify(process.env.npm_package_version),
	},
})
