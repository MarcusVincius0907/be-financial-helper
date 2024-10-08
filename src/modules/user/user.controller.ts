import { BadRequestException, Body, Controller, Post, UnauthorizedException, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, LoginUserDto, User } from "src/models/user.model";
import { JwtService } from "@nestjs/jwt";


@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  @Post("register")
  async register(
    @Body(new ValidationPipe({ whitelist: true })) createUserDto: CreateUserDto,
  ) {
    try{
        const { email, password } = createUserDto;
    
        const userExists = await this.userService.findOneByEmail(email);
        if (userExists) {
          throw new BadRequestException('Email already exists');
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.userService.create(email, hashedPassword);

        this.createToken(newUser);
    
        return { status: 'success', data: 'Usuário Criado com sucesso' };
    }catch(e){
        return { status: 'error', data: e };
    }
  }

  @Post('login')
  async login(
    @Body(new ValidationPipe({ whitelist: true })) loginUserDto: LoginUserDto
  ) {
    try{
        const { email, password } = loginUserDto;
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }

        if (!(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }
        const token = this.createToken(user);
        return { status: 'success', data: token };

    } catch(e){
        return { status: 'error', data: e };
    }
   
  }

  createToken(user: User) {
    const payload = { email: user.email, id: user?._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
