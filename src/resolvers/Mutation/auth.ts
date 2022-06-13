import {Context} from "../../index";
import validator from "validator";
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import {JSON_SIGNATURE} from "../../keys";
interface SingupArgs {
    input:{
        name:string,
        email:string,
        password:string,
        bio:string
    }
}
interface UserPaylaod{
    userErrors:{message:string}[],
    token:string | null
}
export const authResolver = {
        signup:async (_:any, {input}:SingupArgs,{prisma}:Context):Promise<UserPaylaod>=>{
            const {name,email,password, bio} = input
            console.log(input)
            const isEmail = validator.isEmail(email)
            console.log(isEmail)
            if(!isEmail){
                return {
                    userErrors:[{message:'Invalid password'}],
                    token:null
                }
            }
            const isValidatePassword = validator.isLength(password,{
                min:5
            })
            if(!isValidatePassword){
                return {
                    userErrors:[{message:'Invalid password '}],
                    token:null
                }
            }

            if(!name || !bio){
                return {
                    userErrors:[{message:'Invalid name or bio'}],
                    token:null
                }
            }
            const hashPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data:{
                    email,
                    name,
                    password:hashPassword
                }
            })

            await prisma.profile.create({data:{bio,userId:user.id}})

            const token = JWT.sign({
                userId:user.id,
                email:email
            },JSON_SIGNATURE,{expiresIn:360000})

            return{
                token:token,
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
