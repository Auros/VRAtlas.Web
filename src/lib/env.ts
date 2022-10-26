const atlasApiUrl = import.meta.env.VITE_ATLAS_API_URL as string;
const atlasUrl = (path: string) => atlasApiUrl + path;

export { atlasApiUrl, atlasUrl };
