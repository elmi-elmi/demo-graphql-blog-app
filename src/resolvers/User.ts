import {Context} from "../index";

interface UserParentType{
    id: number
}


export const User = {
    posts:(parent:UserParentType,_:any,{prisma, userInfo}:Context)=>{
        console.log('*****',parent)
        const isOwnProfile = parent.id === userInfo?.userId

        if(isOwnProfile) {
            return prisma.post.findMany({
                where:{authorId:parent.id},
                orderBy:[{createdAt:'desc'}]
            })
        }else{
            return prisma.post.findMany({
                where:{authorId:parent.id,published:true},
                orderBy:[{createdAt:'desc'}]
            })
        }


    }
}
