import {Context} from "../index";


interface ProfileParentType {
    id: string,
    bio: string,
    userId: number

}

export const Profile = {
    user: (parent: ProfileParentType, {}: {}, {prisma}: Context) => {
        return prisma.user.findUnique({
            where: {
                id: parent.userId
            }
        })
    }
}
