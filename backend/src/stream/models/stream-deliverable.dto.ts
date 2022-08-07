import { IsNotEmpty } from 'class-validator';
import { MessageEntity } from '../message/models/message.entity';
import { StreamEntity } from './stream.entity';

export class StreamDeliverableDto {
    @IsNotEmpty()
    stream: StreamEntity;

    @IsNotEmpty()
    messages: MessageEntity[];
}
