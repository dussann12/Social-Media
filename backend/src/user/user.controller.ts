import { ParseIntPipe, Patch, UseGuards } from "@nestjs/common";


import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete
} from '@nestjs/common';

import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@CurrentUser() user: any) {
        return this.userService.getUserProfile(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update')
    async updateProfile(
        @CurrentUser() user: any,
        @Body() updateData: { name?: string; email?: string; password?; string },
    ) {
        return this.userService.updateUserProfile(user.id, updateData);
    }

    @Post()
    createUser (
        @Body()
       data: { email: string; name?: string; password: string },
    ) {
        return this.userService.createUser(data);
    }

    @Get()
    getAllUsers() {
        return this.userService.getUser();
    }

    @Get(':id')
    getUserById(@Param('id') id: string) {
        return this.userService.getUserById(+id);
    }

    @Put(':id')
    updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body()
        data: { email?: string; name?: string; password?: string },
    ) {
        return this.userService.updateUserById(id ,data);
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deletesUserById(id);
    }

    
}