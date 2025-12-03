import { HttpException, Injectable  } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    
    constructor(private prisma: PrismaService) {}

    async getUserProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }

  async updateUserProfile(
    userId: number,
    data: { name?: string; email?: string; password?: string },
  ) {
    const updatedData: any = { ...data };


    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updatedData,
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }


    getUserByEmail(email: string) { 
        return this.prisma.user.findUnique({ where: { email } }) }

    async createUser(data: { email: string; name?: string; password: string }) {
        
        return this.prisma.user.create({ data });
    }

    getUser() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,  
            }
        });
    }

    getUserById(id: number) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async deletesUserById(id: number) {
        const findUser = await this.getUserById(id);
        if (!findUser) throw new HttpException('User not found', 404);
        return this.prisma.user.delete({ where: { id } });
    }

    async updateUserById(id: number, data: { email?: string; name?: string; password?: string }) {
        const existingUser  = await this.getUserById(id);
        if (!existingUser ) throw new HttpException('User Not Found', 404);

        if(data.email) {
            const emailTaken  = await this.prisma.user.findUnique({ 
                where: { email: data.email as string },
            });
            if (emailTaken  && emailTaken.id !== id) throw new HttpException('email already taken', 409);
        }
return this.prisma.user.update({ where: { id }, data });

    }

}