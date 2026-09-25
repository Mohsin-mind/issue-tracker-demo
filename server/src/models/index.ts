import { sequelize } from '../config/database';
import { User } from './user.model';
import { Project } from './project.model';
import { ProjectMember } from './project-member.model';
import { BoardColumn } from './board-column.model';
import { Issue } from './issue.model';
import { Label } from './label.model';
import { IssueLabel } from './issue-label.model';
import { Comment } from './comment.model';
import { Epic } from './epic.model';

// --- Associations ---

// Project <-> Epic (1:N)
Project.hasMany(Epic, {
  foreignKey: 'project_id',
  as: 'epics',
  onDelete: 'CASCADE',
});
Epic.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'project',
});

// Epic <-> Issue (1:N)
Epic.hasMany(Issue, {
  foreignKey: 'epic_id',
  as: 'issues',
  onDelete: 'SET NULL',
});
Issue.belongsTo(Epic, {
  foreignKey: 'epic_id',
  as: 'epic',
  onDelete: 'SET NULL',
});

// Project <-> BoardColumn (1:N)
Project.hasMany(BoardColumn, {
  foreignKey: 'project_id',
  as: 'columns',
  onDelete: 'CASCADE',
});
BoardColumn.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'project',
});

// Project <-> User through ProjectMember (M:N)
Project.belongsToMany(User, {
  through: ProjectMember,
  foreignKey: 'project_id',
  otherKey: 'user_id',
  as: 'members',
});
User.belongsToMany(Project, {
  through: ProjectMember,
  foreignKey: 'user_id',
  otherKey: 'project_id',
  as: 'projects',
});

// Project <-> Issue (1:N)
Project.hasMany(Issue, {
  foreignKey: 'project_id',
  as: 'issues',
  onDelete: 'CASCADE',
});
Issue.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'project',
});

// BoardColumn <-> Issue (1:N)
BoardColumn.hasMany(Issue, {
  foreignKey: 'column_id',
  as: 'issues',
  onDelete: 'RESTRICT',
});
Issue.belongsTo(BoardColumn, {
  foreignKey: 'column_id',
  as: 'column',
});

// Issue <-> User (Assignee)
Issue.belongsTo(User, {
  foreignKey: 'assignee_id',
  as: 'assignee',
  onDelete: 'SET NULL',
});
User.hasMany(Issue, {
  foreignKey: 'assignee_id',
  as: 'assigned_issues',
});

// Issue <-> User (Reporter)
Issue.belongsTo(User, {
  foreignKey: 'reporter_id',
  as: 'reporter',
  onDelete: 'RESTRICT',
});
User.hasMany(Issue, {
  foreignKey: 'reporter_id',
  as: 'reported_issues',
});

// Project <-> Label (1:N)
Project.hasMany(Label, {
  foreignKey: 'project_id',
  as: 'labels',
  onDelete: 'CASCADE',
});
Label.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'project',
});

// Issue <-> Label through IssueLabel (M:N)
Issue.belongsToMany(Label, {
  through: IssueLabel,
  foreignKey: 'issue_id',
  otherKey: 'label_id',
  as: 'labels',
});
Label.belongsToMany(Issue, {
  through: IssueLabel,
  foreignKey: 'label_id',
  otherKey: 'issue_id',
  as: 'issues',
});

// Issue <-> Comment (1:N)
Issue.hasMany(Comment, {
  foreignKey: 'issue_id',
  as: 'comments',
  onDelete: 'CASCADE',
});
Comment.belongsTo(Issue, {
  foreignKey: 'issue_id',
  as: 'issue',
});

// User <-> Comment (1:N)
User.hasMany(Comment, {
  foreignKey: 'user_id',
  as: 'comments',
  onDelete: 'CASCADE',
});
Comment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'author',
});

export {
  sequelize,
  User,
  Project,
  ProjectMember,
  BoardColumn,
  Issue,
  Label,
  IssueLabel,
  Comment,
  Epic,
};
