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
interface SigninArgs{
    credentials:{
        password:string,
        email:string
    }
}
export const authResolver = {
    signin:async(_:any,{credentials}:SigninArgs,{prisma}:Context):Promise<UserPaylaod>=>{
        console.log('***** sign in ******')
        const {password,email} = credentials;
        const user = await prisma.user.findUnique({where:{email}})
        if(!user) return {token:null,userErrors:[{message:'Invalid credentials'}]}
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return {token:null,userErrors:[{message:'Invalid credentials'}]}

        return {
            userErrors:[],
            token:JWT.sign({
                userId:user.id
            },JSON_SIGNATURE,{expiresIn:3600000})
        }

    }
    ,
        signup:async (_:any, {input}:SingupArgs,{prisma}:Context):Promise<UserPaylaod>=>{
            console.log('***** sign up ******')

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

            return{
                token:JWT.sign({
                    userId:user.id,
                    email:email
                },JSON_SIGNATURE,{expiresIn:360000})
                ,
                userErrors:[]
            }
        }
}
