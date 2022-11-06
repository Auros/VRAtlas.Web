import type { ImageVariants } from './ImageVariants';

export interface Context {
    id: string;
    name: string;
    description: string;
    type: number;
    icon: ImageVariants;
}
