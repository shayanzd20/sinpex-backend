import { Model, Column, Table, ForeignKey, HasMany,DataType, BelongsTo } from 'sequelize-typescript';
import Project from './Project';
import KanbanCase from './KanbanCase';

@Table
class KanbanColumn extends Model {
    @Column({
        type: DataType.STRING,  
        allowNull: false        
    })
    name!: string;

    @Column({
        type: DataType.STRING,  
        allowNull: false,
        unique: true   
    })
    columnId!: string;

    @ForeignKey(() => Project)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    projectId!: string;

    @HasMany(() => KanbanCase)
    cases!: KanbanCase[];
}

export default KanbanColumn;
