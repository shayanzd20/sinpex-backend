import { Model, Column, Table, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import KanbanColumn from './KanbanColumn';

@Table
class KanbanCase extends Model {
    @Column({
        type: DataType.STRING, 
        allowNull: false,   
    })
    title!: string;

    @Column({
        type: DataType.STRING,  
        allowNull: false,      
    })
    caseId?: string;

    @Column({
        type: DataType.INTEGER, 
        allowNull: true,       
        defaultValue: 0        
    })
    progress!: number;

    @ForeignKey(() => KanbanColumn)
    @Column({
        type: DataType.STRING, 
        allowNull: false        
    })
    columnId!: string;
}

export default KanbanCase;
