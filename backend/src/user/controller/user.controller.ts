import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findAll();
    }
}
