import type { Role } from "./Role";
import type { ImageVariants } from "./ImageVariants";

export interface User {
    id: string;
    name: string;
    roles: Role[];
    icon: ImageVariants;
}