import type User from "./User"
import type GroupMemberRole from "./GroupMemberRole"

type GroupMember = {
    user: User;
    role: GroupMemberRole;
}

export default GroupMember