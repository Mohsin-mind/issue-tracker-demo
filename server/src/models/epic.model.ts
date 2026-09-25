import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { EpicStatus } from '../constants/status.constants';

export interface EpicAttributes {
  id: string;
  project_id: string;
  name: string;
  description?: string | null;
  color: string;
  status: EpicStatus;
  created_at?: Date;
  updated_at?: Date;
}

export type EpicCreationAttributes = Optional<
  EpicAttributes,
  'id' | 'description' | 'color' | 'status' | 'created_at' | 'updated_at'
>;

export class Epic extends Model<EpicAttributes, EpicCreationAttributes> implements EpicAttributes {
  declare id: string;
  declare project_id: string;
  declare name: string;
  declare description: string | null;
  declare color: string;
  declare status: EpicStatus;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Epic.init(
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
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '#8b5cf6',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(EpicStatus)),
      allowNull: false,
      defaultValue: EpicStatus.TODO,
    },
  },
  {
    sequelize,
    tableName: 'epics',
    indexes: [
      {
        fields: ['project_id'],
      },
    ],
  }
);
