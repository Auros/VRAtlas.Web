import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter({ regions: ['sfo1'] }),
        csrf: {
            checkOrigin: process.env.MODE !== 'dev'
        }
    },
    preprocess: [
        vitePreprocess({
            postcss: true
        })
    ]
};

export default config;
