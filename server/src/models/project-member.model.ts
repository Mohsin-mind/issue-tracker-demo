import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ProjectMemberAttributes {
  id: string;
  project_id: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export type ProjectMemberCreationAttributes = Optional<ProjectMemberAttributes, 'id' | 'created_at' | 'updated_at'>;

export class ProjectMember extends Model<ProjectMemberAttributes, ProjectMemberCreationAttributes> implements ProjectMemberAttributes {
  public id!: string;
  public project_id!: string;
  public user_id!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ProjectMember.init(
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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'project_members',
    indexes: [
      {
        unique: true,
        fields: ['project_id', 'user_id'],
      },
    ],
  }
);
