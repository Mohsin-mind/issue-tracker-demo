import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { IssuePriority } from '../constants/status.constants';

export interface IssueAttributes {
  id: string;
  project_id: string;
  column_id: string;
  issue_number: number;
  title: string;
  description?: string | null;
  priority: IssuePriority;
  assignee_id?: string | null;
  reporter_id: string;
  position: number;
  due_date?: Date | string | null;
  created_at?: Date;
  updated_at?: Date;
}

export type IssueCreationAttributes = Optional<
  IssueAttributes,
  'id' | 'description' | 'assignee_id' | 'due_date' | 'created_at' | 'updated_at'
>;

export class Issue extends Model<IssueAttributes, IssueCreationAttributes> implements IssueAttributes {
  declare id: string;
  declare project_id: string;
  declare column_id: string;
  declare issue_number: number;
  declare title: string;
  declare description?: string | null;
  declare priority: IssuePriority;
  declare assignee_id?: string | null;
  declare reporter_id: string;
  declare position: number;
  declare due_date?: Date | string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  // Eager loaded associations
  declare labels?: any[];
  declare comments?: any[];
  declare assignee?: any;
  declare reporter?: any;
  public project?: any;

  // Helper getter for formatted issue key if project is loaded
  public get issue_key(): string | undefined {
    const project = (this as any).project;
    if (project && project.key) {
      return `${project.key}-${this.issue_number}`;
    }
    return undefined;
  }
}

Issue.init(
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
    column_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'board_columns',
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    issue_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(IssuePriority)),
      allowNull: false,
      defaultValue: IssuePriority.MEDIUM,
    },
    assignee_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    reporter_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    position: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'issues',
    indexes: [
      {
        unique: true,
        fields: ['project_id', 'issue_number'],
      },
      {
        fields: ['column_id', 'position'],
      },
      {
        fields: ['assignee_id'],
      },
    ],
  }
);
