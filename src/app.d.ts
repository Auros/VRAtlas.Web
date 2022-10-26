// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
    // interface Locals {}
    interface PageData {
        user: import('$lib/types/User').User | null
        pathName: string
    }
    // interface Error {}
    // interface Platform {}
}
