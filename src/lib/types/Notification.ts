import type EntityType from "./EntityType";

type Notification = {
    id: string;
    userId: string;
    key: string;
    title: string;
    description: string;
    entityId?: string;
    entityType?: EntityType;
    createdAt: string;
    read: boolean;
}

export default Notification;