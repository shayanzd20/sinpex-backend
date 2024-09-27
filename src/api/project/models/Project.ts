import { Model, Column, Table, HasMany, DataType } from 'sequelize-typescript';
import KanbanColumn from './KanbanColumn';

@Table
class Project extends Model {
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
    projectId!: string;

    @HasMany(() => KanbanColumn)
    columns!: KanbanColumn[];
}

export default Project;
