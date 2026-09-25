import { Model, DataTypes, Optional, BelongsToManyGetAssociationsMixin, HasManyGetAssociationsMixin } from 'sequelize';
import { sequelize } from '../config/database';
import type { User } from './user.model';
import type { BoardColumn } from './board-column.model';

export interface ProjectAttributes {
  id: string;
  name: string;
  key: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type ProjectCreationAttributes = Optional<ProjectAttributes, 'id' | 'description' | 'created_at' | 'updated_at'>;

export class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: string;
  public name!: string;
  public key!: string;
  public description?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Association Mixins
  public getMembers!: BelongsToManyGetAssociationsMixin<User>;
  public getColumns!: HasManyGetAssociationsMixin<BoardColumn>;
}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: {
        isUppercase: true,
        len: [2, 10],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'projects',
    indexes: [
      {
        unique: true,
        fields: ['key'],
      },
    ],
  }
);
