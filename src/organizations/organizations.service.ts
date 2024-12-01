import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prismaService: PrismaService) { }


  async create(createOrganizationDto: CreateOrganizationDto) {
    await this.checkIfOrganizationExists(createOrganizationDto.name);
    return this.prismaService.organization.create({ data: createOrganizationDto })

  }


  async findAll() {
    return this.prismaService.organization.findMany();
  }

  async findOne(id: number) {
    return this.getOrganizations(id);
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    await this.getOrganizations(id);
    await this.checkIfOrganizationExists(updateOrganizationDto.name, id);
    return this.prismaService.organization.update({
      where: { id },
      data: updateOrganizationDto,

    });
  }

  async remove(id: number) {
    await this.getOrganizations(id);
    return this.prismaService.organization.delete({ where: { id } });
  }
  private async getOrganizations(id: number) {
    const organizations = await this.prismaService.organization.findFirst({ where: { id } });
    if (!organizations) {
      throw new NotFoundException('Organizations not found');
    }
    return organizations;
  }


  private async checkIfOrganizationExists(name: string, id?: number) {
    const doesOrganizationExist = await this.prismaService.organization.findFirst({
      where: { name },
    });

    if (doesOrganizationExist) {
      if (id && doesOrganizationExist.id !== id) {
        //this is update case
        throw new BadRequestException(`Organizations ${name} already exists`);
      }
      else if (!id) {
        //this is create case
        throw new BadRequestException(`Organizations ${name} already exists`);
      }
    }
  }
}
