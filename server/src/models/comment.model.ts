import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CommentAttributes {
  id: string;
  issue_id: string;
  user_id: string;
  body: string;
  created_at?: Date;
  updated_at?: Date;
}

export type CommentCreationAttributes = Optional<CommentAttributes, 'id' | 'created_at' | 'updated_at'>;

export class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  declare id: string;
  declare issue_id: string;
  declare user_id: string;
  declare body: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    issue_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'issues',
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
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'comments',
    indexes: [
      {
        fields: ['issue_id'],
      },
      {
        fields: ['user_id'],
      },
    ],
  }
);
