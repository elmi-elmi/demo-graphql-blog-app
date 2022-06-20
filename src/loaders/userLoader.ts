import Dataloader from 'dataloader';
import {User} from '@prisma/client';
import {prisma} from "../index";

type BatchUser = (ids:number[])=>Promise<User[]>


const batchUser:BatchUser = async (ids)=>{
    console.log('**************************')
    const users = await prisma.user.findMany({
        where:{
            id:{
                in:ids
            }
        }
    });
    const userMap:{[key:string]:User} ={}
    users.forEach(user=>{
        userMap[user.id] = user
    })

    return ids.map(id=>userMap[id])
}

// @ts-ignore
export const userLoader = new Dataloader(batchUser);
