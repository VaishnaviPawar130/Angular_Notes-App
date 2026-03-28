import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';
export class Note extends Model {
}
Note.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    createdAtMs: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'created_at',
    },
    pinned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    aiSummary: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'ai_summary',
    },
}, {
    sequelize,
    tableName: 'notes',
});
