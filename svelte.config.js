import node from '@sveltejs/adapter-node';
import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: [
            vercel({ regions: ['sfo1'] }),
            node()
        ],
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
