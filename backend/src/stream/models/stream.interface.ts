import { Message } from "src/message/models/message.interface";

export interface Stream {
    messages: Message[];
}