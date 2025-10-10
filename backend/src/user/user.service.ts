import { HttpException, Injectable  } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async createUser(data: { email: string; name?: string; password: string }) {
        if(data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);

            data.password = hashedPassword;
        }
        return this.prisma.user.create({ data });
    }

    getUser() {
        return this.prisma.user.findMany();
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
        const findUser = await this.getUserById(id);
        if (!findUser) throw new HttpException('User Not Found', 404);

        if(data.name) {
            const findUser = await this.prisma.user.findUnique({ 
                where: { username: data.name as string },
            });
            if (findUser) throw new HttpException('Username already taken', 404);
        }
return this.prisma.user.update({ where: { id }, data });

    }

}