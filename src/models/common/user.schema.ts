import { USER_AGENT } from '@modules/auth/entities/auth.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  discriminatorKey: 'role',
  toJSON: { virtuals: true },
})
export class User {
  @Prop({ type: String, required: true })
  userName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required(){
    if(this.userAgent == USER_AGENT.google) {
      return false
    }
    return true
  }})
  password: string;

  @Prop({ type: String })
  otp: string;

  @Prop({ type: Date }) 
  otpExpiry: Date;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Number, enum: USER_AGENT, default: USER_AGENT.local })
  userAgent: number;
}

export const userSchema = SchemaFactory.createForClass(User);
