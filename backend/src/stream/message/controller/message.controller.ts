import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Message } from '../models/message.interface';
import { MessageService } from '../service/message.service';

@Controller('messages')
export class MessageController {
    constructor(private messageService: MessageService) {}

    @Get()
    findAll(): Observable<Message[]> {
        return this.messageService.findAll();
    }
}
