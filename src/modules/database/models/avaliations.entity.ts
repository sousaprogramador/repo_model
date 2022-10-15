import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Adjective } from "./adjectives.entity";
import { User } from "./users.entity";

@Entity({ name: 'avaliations' })
class Avaliation extends BaseEntity {
    constructor(data?: Partial<Avaliation>) {
        super();

        if (data) {
            const dataAttributes = JSON.parse(JSON.stringify(data));
            Object.assign(this, dataAttributes);
        }
    }

    @ApiProperty({ type: 'integer' })
    @PrimaryGeneratedColumn('increment')
    id?: number;

    @ApiProperty({ type: 'string', required: true })
    @Column({ type: 'text' })
    text: string;

    @ApiProperty({ type: 'decimal', required: true })
    @Column({ type: 'decimal', precision: 2, scale: 4 })
    rating: number;

    @Column()
    userId: number;

    @Column()
    originUserId: number;

    @ManyToOne(() => User, user => user.avaliations)
    user: User;

    @ManyToOne(() => User, user => user.reviews, { eager: true })
    originUser: User;

    @ManyToMany(() => Adjective, adjective => adjective.avaliation, { eager: true })
    @JoinTable({
        name: 'avaliationAdjectives',
        joinColumn: { name: 'avaliationId' },
        inverseJoinColumn: { name: 'adjectiveId' }
    })
    adjectives: Adjective[] | number[];

    @CreateDateColumn()
    createdAt?: Date | null;

    @UpdateDateColumn()
    updatedAt?: Date | null;

    @ApiProperty({ type: 'string', format: 'date-time', default: null })
    @DeleteDateColumn()
    deletedAt?: Date | null;
}

export { Avaliation };
