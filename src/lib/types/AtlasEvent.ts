import type Group from './Group';
import type EventStatus from './EventStatus';
import type User from './User';

type AtlasEvent = {
    id: string;
    name: string;
    description: string;
    owner: Group;
    status: EventStatus;
    tags: string[];
    startTime?: string;
    endTime?: string;
    media: string;
    stars: {
        user: User;
        status: number;
    }[];
};

export default AtlasEvent;
