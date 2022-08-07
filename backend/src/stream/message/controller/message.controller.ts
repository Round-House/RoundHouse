import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MessageEntity } from '../models/message.entity';
import { MessageService } from '../service/message.service';

@Controller('messages')
export class MessageController {
    constructor(private messageService: MessageService) {}

    @Get()
    findAll(): Observable<MessageEntity[]> {
        return this.messageService.findAll();
    }
}
