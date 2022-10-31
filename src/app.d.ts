// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
    // interface Locals {}
    interface PageData {
        pathName: string
        token: string | null
        currentUser: import('$lib/types/User').User | null
    }
    // interface Error {}
    // interface Platform {}
}
