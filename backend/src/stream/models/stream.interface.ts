import { Message } from 'src/stream/message/models/message.interface';

export interface Stream {
    id: any;
    messages: Message[];
}
