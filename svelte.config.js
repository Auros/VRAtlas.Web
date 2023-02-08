import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter(),
        csrf: {
            checkOrigin: process.env.MODE !== "dev"
        }
    },
    preprocess: [
        vitePreprocess({
            postcss: true
        })
    ]
};

export default config;
