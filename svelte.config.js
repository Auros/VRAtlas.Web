<<<<<<< HEAD
import adapter from '@sveltejs/adapter-auto';
=======
import node from '@sveltejs/adapter-node';
import vercel from '@sveltejs/adapter-vercel';
>>>>>>> parent of de30857 (Update svelte.config.js)
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
<<<<<<< HEAD
        adapter: adapter(),
=======
        adapter: [
            vercel({ regions: ['sfo1'] }),
            node()
        ],
>>>>>>> parent of de30857 (Update svelte.config.js)
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
