import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface BoardColumnAttributes {
  id: string;
  project_id: string;
  name: string;
  position: number;
  created_at?: Date;
  updated_at?: Date;
}

export type BoardColumnCreationAttributes = Optional<BoardColumnAttributes, 'id' | 'created_at' | 'updated_at'>;

export class BoardColumn extends Model<BoardColumnAttributes, BoardColumnCreationAttributes> implements BoardColumnAttributes {
  declare id: string;
  declare project_id: string;
  declare name: string;
  declare position: number;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

BoardColumn.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'board_columns',
    indexes: [
      {
        fields: ['project_id'],
      },
      {
        fields: ['project_id', 'position'],
      },
    ],
  }
);
