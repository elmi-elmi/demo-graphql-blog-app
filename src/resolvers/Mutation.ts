import {Context} from "../index";
import {Post, Prisma} from '.prisma/client'

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

export const Mutation = {
    postCreate: async (_: any, {post}: PostArgs, {prisma}: Context): Promise<PostPayLoadType> => {
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
                    authorId: 2,
                    title,
                    content
                }
            })
        }


    },

    postUpdate: async (_: any, {
        postId,
        post
    }: { postId: string, post: PostArgs["post"] }, {prisma}: Context):Promise<PostPayLoadType> => {
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
    postDelete:async (_:any,{postId}:{postId:string},{prisma}:Context):Promise<PostPayLoadType> =>{
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
