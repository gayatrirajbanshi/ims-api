import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly organizationsService: OrganizationsService,
    private readonly rolesService: RolesService) { }

  async create(createUserDto: CreateUserDto) {
    const roleObj = await this.prismaService.role.findFirst({
      where: {name: createUserDto.role},
    });
    if (!roleObj){
      throw new BadRequestException(`Role ${createUserDto.role} not found`);
    }
     createUserDto.role_id = roleObj.id;
     await this.organizationsService.findOne(createUserDto.organization_id)

    await this.checkIfUserEmailExists(createUserDto.email);
    await this.checkIfUserMobileExists(createUserDto.mobile);
    
    createUserDto.password = await hash (createUserDto.password, 10);

     const{ role, ...rest } = createUserDto;
     return this.prismaService.user.create({ data: rest});
   }

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: number) {
    return this.getUserById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user =await this.getUserById(id);

    if(updateUserDto.role_id){
      await this.rolesService.findOne(updateUserDto.role_id);
    }

    if(updateUserDto.organization_id){
      await this.organizationsService.findOne(updateUserDto.organization_id);
    }

    if (updateUserDto.email){
   await this.checkIfUserEmailExists(updateUserDto.email, id);
    }
    if (updateUserDto.mobile){
     await this.checkIfUserMobileExists(updateUserDto.mobile, id);
    }
     if (updateUserDto.password && user.password !== updateUserDto.password){
      updateUserDto.password = await hash(updateUserDto.password, 10);
     }

     return this.prismaService.user.update({
       where: { id },
       data: updateUserDto,
    });
   }

  async remove(id: number) {
    await this.getUserById(id);
    return this.prismaService.user.delete({ where: { id } });
  }

  private async getUserById(id: number) {
    const user = await this.prismaService.user.findFirst({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }
    return user;
  }


  private async checkIfUserEmailExists(email: string, id?: number) {
    const doesUserEmailExist = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (doesUserEmailExist) {
      if (id && doesUserEmailExist.id !== id) {
        //this is update case
        throw new BadRequestException(`User with email ${email} already exists`);
      }
      else if (!id) {
        //this is create case
        throw new BadRequestException(`User with email ${email} already exists`);
      }
    }
  }


  private async checkIfUserMobileExists(mobile: string, id?: number) {
    const doesUserMobileExist = await this.prismaService.user.findFirst({
      where: { mobile },
    });

    if (doesUserMobileExist) {
      if (id && doesUserMobileExist.id !== id) {
        //this is update case
        throw new BadRequestException(`User ${mobile} already exists`);
      }
      else if (!id) {
        //this is create case
        throw new BadRequestException(`User ${mobile} already exists`);
      }
    }
  }
}


