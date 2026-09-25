import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface LabelAttributes {
  id: string;
  project_id: string;
  name: string;
  color: string;
  created_at?: Date;
  updated_at?: Date;
}

export type LabelCreationAttributes = Optional<LabelAttributes, 'id' | 'created_at' | 'updated_at'>;

export class Label extends Model<LabelAttributes, LabelCreationAttributes> implements LabelAttributes {
  public id!: string;
  public project_id!: string;
  public name!: string;
  public color!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Label.init(
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
    color: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '#6366f1',
    },
  },
  {
    sequelize,
    tableName: 'labels',
    indexes: [
      {
        unique: true,
        fields: ['project_id', 'name'],
      },
    ],
  }
);
