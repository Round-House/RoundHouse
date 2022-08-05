import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { StreamEntity } from '../models/stream.entity';

@Injectable()
export class StreamService {
    constructor(
        @InjectRepository(StreamEntity)
        private readonly streamRepository: Repository<StreamEntity>,
    ) {}

    getStream(id: number, relations: string[]): Observable<StreamEntity> {
        return from(
            this.streamRepository.findOneOrFail({
                where: { id },
                relations: relations,
            }),
        ).pipe(
            map((stream: StreamEntity) => {
                return stream;
            }),
        );
    }
}
