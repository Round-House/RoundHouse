import { IsNotEmpty } from 'class-validator';
import { Message } from '../message/models/message.interface';
import { Stream } from './stream.interface';

export class StreamDeliverableDto {
    @IsNotEmpty()
    stream: Stream;

    @IsNotEmpty()
    messages: Message[];
}
