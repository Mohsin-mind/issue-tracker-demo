import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface IssueLabelAttributes {
  issue_id: string;
  label_id: string;
}

export class IssueLabel extends Model<IssueLabelAttributes> implements IssueLabelAttributes {
  declare issue_id: string;
  declare label_id: string;
}

IssueLabel.init(
  {
    issue_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'issues',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    label_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'labels',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'issue_labels',
    timestamps: false,
  }
);
