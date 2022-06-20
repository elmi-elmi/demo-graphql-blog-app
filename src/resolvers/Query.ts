import {Context} from "../index";


export const Query =  {
    posts:async (_:any,{take, skip}:{take:number, skip:number}, {prisma}:Context)=>{
        return prisma.post.findMany({
            orderBy:{
                createdAt:'desc'
            },
            where:{
                published:true
            },
            take,
            skip
        })
    },
    me:(_:any,__:any,{userInfo,prisma}:Context)=>{
        if(!userInfo) return null

        return prisma.user.findUnique({
            where:{id:userInfo.userId}
        })
    },
    profile:(_:any, {userId}:{userId:string}, {prisma}:Context)=>{
        return prisma.profile.findUnique({
            where:{
                userId:Number(userId)
            }
        })
    }
}


