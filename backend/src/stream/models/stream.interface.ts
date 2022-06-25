import { Message } from "src/message/models/message.interface";

export interface Stream {
    id: any;
    messages: Message[];
}