import type GroupMember from './GroupMember';

type Group = {
    id: string;
    name: string;
    description: string;
    members: GroupMember[];
    icon: string;
    banner: string;
    createdAt: string;
};

export default Group;
