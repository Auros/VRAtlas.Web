/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';
import { EntityType, type Notification as Notif } from './lib/types';

const sw = self as unknown as ServiceWorkerGlobalScope;
const CACHE = `cache-${version}`;
const ASSETS = [
    ...build, // the app itself
    ...files  // everything in `static`
  ];

sw.addEventListener('install', (event) => {
    console.log('[VR Atlas - Service Worker] Installed');
    // Create a new cache and add all files to it
    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await cache.addAll(ASSETS);
    }
    event.waitUntil(addFilesToCache());
});

sw.addEventListener('activate', (event) => {
    console.log('[VR Atlas - Service Worker] Activated');
    // Remove previous cached data from disk
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE) {
                await caches.delete(key);
            }
        }
    }
 
  event.waitUntil(deleteOldCaches());
});

sw.addEventListener('fetch', async (event) => {
    // ignore POST requests etc
    if (event.request.method !== 'GET') {
        return;
    }
 
    async function respond() {
        const url = new URL(event.request.url);
        const cache = await caches.open(CACHE);

        // `build`/`files` can always be served from the cache
        if (ASSETS.includes(url.pathname)) {
            return cache.match(event.request);
        }

        // for everything else, try the network first, but
        // fall back to the cache if we're offline
        try {
            const response = await fetch(event.request);
            if (response.status === 200) {
                cache.put(event.request, response.clone());
            }
            return response;
        } catch {
            return cache.match(event.request);
        }
    }

    event.respondWith(respond() as unknown as Promise<Response>);
})

sw.addEventListener('push', async (event) => {
    const dataString = event.data?.text();
    if (!dataString || !dataString.startsWith('{')) {
        console.log(`[VR Atlas - Service Worker] Unknown Push Event: ${dataString}`);
        return;
    }

    const notif = JSON.parse(dataString) as unknown as Notif;

    sw.registration.showNotification(`VR Atlas | ${notif.title}`, {
        data: notif,
        body: notif.description,
        lang: 'en-US'
    });
})

sw.addEventListener('notificationclick', async (event) => {
    console.log('[VR Atlas - Service Worker] Notification Clicked');
    event.notification.close();

    const notif = event.notification.data as unknown as Notif;
    if (!notif.entityId || !notif.entityType) {
        return;
    }

    let url = '/';
    if (notif.key === 'EVENT_STAR_INVITED') {
        url = `/events/${notif.entityId}/invite`
    } else if (notif.entityType === EntityType.Event) {
        url = `/events/${notif.entityId}`;
    } else if (notif.entityType === EntityType.Group) {
        url = `/groups/${notif.entityId}`;
    } else if (notif.entityType === EntityType.User) {
        url = `/users/${notif.entityId}`;
    }

    const open = sw.clients.openWindow(url);
    event.waitUntil(open);
})