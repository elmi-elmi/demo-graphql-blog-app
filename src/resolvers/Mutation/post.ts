import {Context} from "../../index";
import {Post, Prisma} from '.prisma/client'
import {canUserMutatePost} from "../../utils/canUserMutatePost";

interface PostArgs {
    post: {
        title?: string,
        content?: string,
    }
}

interface PostPayLoadType {
    userErrors: { message: string }[],
    post: Post | Prisma.Prisma__PostClient<Post> | null
}

export const postResolver = {
    postCreate: async (_: any, {post}: PostArgs, {prisma,userInfo}: Context): Promise<PostPayLoadType> => {
        console.log('***** post create ******')
        if(!userInfo) return {userErrors:[{message:'Forbidden access'}],post:null}
        const {userId}= userInfo


        const {title, content} = post
        if (!title || !content) {
            return {
                userErrors: [{
                    message: 'You must provide title and content to create a post.'
                }],
                post: null
            }
        }

        return {
            userErrors: [],
            post: prisma.post.create({
                data: {
                    authorId: userId,
                    title,
                    content,
                }
            })
        }


    },

    postUpdate: async (_: any, {
        postId,
        post
    }: { postId: string, post: PostArgs["post"] }, {prisma,userInfo}: Context):Promise<PostPayLoadType> => {
        console.log('***** post update ******')
        if(!userInfo) return {userErrors:[{message:'Forbidden access'}],post:null}
        const {userId}  = userInfo;

        const error = await canUserMutatePost({userId,postId:Number(postId),prisma})

        if(error) return error


        const {title, content} = post
        if(!title && !content){
            return {
                userErrors:[{
                    message:'Need to have at least one field to update.'
                }],
                post:null
            }
        }

        const existingPost = await prisma.post.findUnique({
            where:{
                id:Number(postId)
            }
        })
        if(!existingPost){
            return{
                userErrors:[{
                    message:'Post does not exist'
                }],
                post:null
            }
        }

        let payloadToUpdate = {title, content}
        if(!title) delete payloadToUpdate.title
        if(!content) delete payloadToUpdate.content

        return{
            userErrors:[],
            post:prisma.post.update({
                data:{...payloadToUpdate},
                where:{id:Number(postId)}
            })
        }
    },
    postDelete:async (_:any,{postId}:{postId:string},{prisma, userInfo}:Context):Promise<PostPayLoadType> =>{
        console.log('***** post delete ******')
        if(!userInfo) return {userErrors:[{message:'Forbidden access'}],post:null}
        const {userId}  = userInfo;

        const error = await canUserMutatePost({userId,postId:Number(postId),prisma})

        if(error) return error

        const post = await prisma.post.findUnique({
            where:{
                id:Number(postId)
            }
        })

        if(!post){
            return{
                userErrors:[{
                    message:'Post does not exist'
                }],
                post:null
            }
        }

        await prisma.post.delete({
            where:{
                id:Number(postId)
            }
        })

        return {
            userErrors:[],
            post
        }
    }
}
