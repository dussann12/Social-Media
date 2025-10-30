import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FriendshipService {
    constructor(private prisma: PrismaService) {}

    async sendRequest(senderId: number, receiverId: number) {
        if(senderId === receiverId) {
            throw new BadRequestException('You cannot send a friend request to yourself');
        }

        const existingRequest = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId: senderId, receiverId },
                    { requesterId: receiverId, receiverId: senderId },
                ],
            },
        });

        if(existingRequest) {
            throw new BadRequestException('Friend request already exists');
        }

        const request = await this.prisma.friendship.create({
            data: {
                requester: { connect: { id: senderId } },
                receiver: { connect: { id: receiverId } },
                status: 'PENDING',
            },
        });

        return { message: 'Friend request sent', request };
    }

    async acceptRequest(requestId: number, userId: number) {
        const request = await this.prisma.friendship.findUnique({
            where: { id: requestId },
        });

        if(!request) {
            throw new NotFoundException('Friend request not found');
        }

        if(request.receiverId !== userId) {
            throw new UnauthorizedException('You can only accept your own friend requests');
        }
        const updated = await this.prisma.friendship.update({
            where: {
                id: requestId
            },
            data: { status: 'ACCEPTED' },
        });

        return { message: 'Friend request accepted', updated };
    }

    async declineRequest(requestId: number, userId: number) {
        const request = await this.prisma.friendship.findUnique({
            where: {
                id: requestId
            },
        });

        if(!request) {
            throw new NotFoundException('Friend request not found');
        }

        if(request.receiverId !== userId) {
            throw new UnauthorizedException('You can only decline your own friend requests');
        }
        const updated = await this.prisma.friendship.update({
            where: {
                id: requestId
            },
            data: { status: 'DECLINED' },
        });

        return { message: 'Friend request declined', updated };
    }

    async getFriends(userId: number) {
        const friendships = await this.prisma.friendship.findMany({
            where: {
                status: 'ACCEPTED',
                OR: [{ requesterId: userId }, { receiverId: userId }],
            },
            include: {
                requester: true,
                receiver: true,
            },
        });

        return friendships.map((friend) => {
            const friendUser = friend.requesterId === userId ? friend.receiver : friend.requester;

            return { 
                id: friendUser.id,
                name: friendUser.name,
                email: friendUser.email,
            };
        });
    }
}