import type ProfileStatus from "./ProfileStatus";

type User = {
    id: string;
    username: string;
    picture: string;
    biography?: string;
    links: string[];
    profileStatus: ProfileStatus;
};

export default User;
