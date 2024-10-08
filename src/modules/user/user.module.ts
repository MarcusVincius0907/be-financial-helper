import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../database/schemas/user.schema";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
        secret: process.env.JWT_SECRET_KEY, // Replace with your secret
        signOptions: { expiresIn: '60m' },
      }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
