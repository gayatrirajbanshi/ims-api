import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto, RegisterDto } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService:PrismaService, 
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        
    ){}

    async register(registerDto: RegisterDto) {
        const user = await this.usersService.create(registerDto);
        const token = await this.jwtService.signAsync({
            user_id: user.id,
            role_id: user.role_id,
            organization_id: user.organization_id,
        });
               return ( token);
    }
     async login(loginDto: LoginDto) {
        const user = await this.prismaService.user.findFirst({
          where:{
            OR: [
                {
                    email: loginDto.username,
                },
                {
                    mobile: loginDto.username,
                },
            ],
            
          }, 
        });

        if (!user) {
            throw new NotFoundException(`user ${loginDto.username} not found`);
        
        }

        if (!(await compare(loginDto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');

        }

        const token = await this.jwtService.signAsync({
            user_id:user.id,
            role_id:user.role_id,
            organization_id: user.organization_id,
        });

         return { token };
     }
}
