import { Types } from "mongoose";

export class Customer {
    readonly _id:Types.ObjectId
    userName:string;
    email:string;
    password:string;
    dob:Date;
    otp:string;
    otpExpiry:Date;
    isVerified:boolean
    userAgent:USER_AGENT
}



export enum USER_AGENT {
  local,
  google
}