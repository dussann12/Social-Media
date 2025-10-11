import { ParseIntPipe } from "@nestjs/common";


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

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

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