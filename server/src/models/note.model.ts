import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';

type NoteAttributes = {
  id: string;
  text: string;
  createdAtMs: number;
  pinned: boolean;
  aiSummary: string | null;
};

type NoteCreationAttributes = Optional<NoteAttributes, 'id' | 'pinned' | 'aiSummary'>;

export class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
  declare id: string;
  declare text: string;
  declare createdAtMs: number;
  declare pinned: boolean;
  declare aiSummary: string | null;
}

Note.init(
  {
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
  },
  {
    sequelize,
    tableName: 'notes',
  }
);
