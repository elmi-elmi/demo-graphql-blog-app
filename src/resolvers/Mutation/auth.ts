import {Context} from "../../index";
import validator from "validator";
import bcrypt from 'bcryptjs';
interface SingupArgs {
    user:{
        name:string,
        email:string,
        password:string,
        bio:string
    }
}
interface UserPaylaod{
    userErrors:{message:string}[],
    user:null
}
export const authResolver = {
        signup:async (_:any, {user}:SingupArgs,{prisma}:Context):Promise<UserPaylaod>=>{
            const {name,email,password, bio} = user
            const isEmail = validator.isEmail(email)
            console.log(isEmail)
            if(!isEmail){
                return {
                    userErrors:[{message:'Invalid password'}],
                    user:null
                }
            }
            const isValidatePassword = validator.isLength(password,{
                min:5
            })
            if(!isValidatePassword){
                return {
                    userErrors:[{message:'Invalid password '}],
                    user:null
                }
            }

            if(!name || !bio){
                return {
                    userErrors:[{message:'Invalid name or bio'}],
                    user:null
                }
            }
            const hashPassword = await bcrypt.hash(password, 10);

            await prisma.user.create({
                data:{
                    email,
                    name,
                    password:hashPassword
                }
            })

            return{
                user:null,
                userErrors:[]
            }
            //
            // return prisma.user.create({
            //     data:{
            //         name,
            //         email,
            //         password,
            //
            //     }
            // })
        }
}
