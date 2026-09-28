import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // .env.local lives at the repo root, next to convex/ (convex dev writes it there)
    envDir: path.resolve(__dirname, ".."),
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@convex": path.resolve(__dirname, "../convex"),
        },
    },
})
