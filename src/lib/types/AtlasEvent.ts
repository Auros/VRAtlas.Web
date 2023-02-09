import type Group from './Group';
import type EventStatus from './EventStatus';

type AtlasEvent = {
    id: string;
    name: string;
    description: string;
    owner: Group;
    status: EventStatus;
    startTime?: string;
    endTime?: string;
    media: string;
};

export default AtlasEvent;
