import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignupInput {
    
    @IsEmail()
    @Field( () => String )
    email: string;

    @IsNotEmpty()
    @Field( () => String )
    fullName: string;

    @MinLength(6)
    @Field( () => String )
    password: string;
}