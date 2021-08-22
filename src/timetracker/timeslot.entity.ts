import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class TimeSlot {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    project: string;

    @CreateDateColumn()
    time_start: Date;

    @Column({ type: "int", nullable: true })
    duration: number;

}
