# VRAtlas (Website)

The VR Atlas is an open-source project created and maintained by me. It aims to provide an easy way for people involved in virtual reality to find more events taking place in VR, while also enabling developer and community participation to enhance the platform.

## Live

You can visit the website at [vratlas.io](https://vratlas.io)

## Developing

**Requirements:**

* Node 16
* Yarn
* IDE of your choice: Highly Recommend VS Code with the [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) extension
* VRAtlas.API: Follow the setup guide to setup the [API](https://github.com/Auros/VRAtlas.API)

**Environment:**

Create a `.env` at the project root with the following keys:
```env
PUBLIC_OAUTH_URL=<insert auth0 url>
PUBLIC_API_URL=<insert dev API>
PUBLIC_CDN_URL=<insert image cdn API URL>
PUBLIC_SERVING_URL=<insert public serving url> # used for generating embed links
NODE_TLS_REJECT_UNAUTHORIZED=0 # use if running the backend OR frontend under http
MODE=dev
```

Run `yarn dev` to spin up the dev server, navigate to your proxy address (recommended, explained in API setup), or the port listed.
