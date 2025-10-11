import { HttpException, Injectable  } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    findUnique(email: string) {
        throw new Error('Method not implemented.');
    }
    
    constructor(private prisma: PrismaService) {}

    getUserByEmail(email: string) { 
        return this.prisma.user.findUnique({ where: { email } }) }

    async createUser(data: { email: string; name?: string; password: string }) {
        if(data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);

            data.password = hashedPassword;
        }
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