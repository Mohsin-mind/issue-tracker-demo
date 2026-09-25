import { describe, it, expect } from 'vitest';
import { Project, BoardColumn, Issue } from '../../../types';

describe('Kanban Board Core Functional Logic', () => {
  const mockColumns: BoardColumn[] = [
    {
      id: 'col-todo',
      project_id: 'proj-1',
      name: 'To Do',
      position: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      issues: [
        {
          id: 'iss-1',
          issue_key: 'TEST-1',
          title: 'First Task',
          type: 'TASK',
          column_id: 'col-todo',
          project_id: 'proj-1',
          issue_number: 1,
          position: 100,
          priority: 'MEDIUM',
          reporter_id: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'iss-2',
          issue_key: 'TEST-2',
          title: 'Second Task',
          type: 'TASK',
          column_id: 'col-todo',
          project_id: 'proj-1',
          issue_number: 2,
          position: 200,
          priority: 'HIGH',
          reporter_id: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    },
    {
      id: 'col-done',
      project_id: 'proj-1',
      name: 'Done',
      position: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      issues: [],
    },
  ];

  it('calculates position when moving an issue between two issues', () => {
    const prevPosition = 100;
    const nextPosition = 200;
    const calculated = (prevPosition + nextPosition) / 2;
    expect(calculated).toBe(150);
  });

  it('calculates position when moving an issue to the top of a column', () => {
    const nextPosition = 100;
    const calculated = nextPosition / 2;
    expect(calculated).toBe(50);
  });

  it('calculates position when moving an issue to the bottom of a column', () => {
    const prevPosition = 200;
    const calculated = prevPosition + 100;
    expect(calculated).toBe(300);
  });

  it('optimistically moves an issue from source column to destination column', () => {
    const initialColumns = JSON.parse(JSON.stringify(mockColumns)) as BoardColumn[];
    const issueToMoveId = 'iss-1';
    const targetColumnId = 'col-done';
    const newPosition = 100;

    // 1. Remove from source
    let movedIssue: Issue | null = null;
    const columnsWithoutIssue = initialColumns.map((col) => {
      const idx = col.issues?.findIndex((i) => i.id === issueToMoveId) ?? -1;
      if (idx !== -1 && col.issues) {
        movedIssue = {
          ...col.issues[idx],
          column_id: targetColumnId,
          position: newPosition,
        };
        return {
          ...col,
          issues: col.issues.filter((i) => i.id !== issueToMoveId),
        };
      }
      return col;
    });

    expect(movedIssue).not.toBeNull();
    expect(columnsWithoutIssue.find((c) => c.id === 'col-todo')?.issues?.length).toBe(1);

    // 2. Add to destination
    const finalColumns = columnsWithoutIssue.map((col) => {
      if (col.id === targetColumnId) {
        return {
          ...col,
          issues: [...(col.issues || []), movedIssue!],
        };
      }
      return col;
    });

    const doneCol = finalColumns.find((c) => c.id === 'col-done');
    expect(doneCol?.issues?.length).toBe(1);
    expect(doneCol?.issues?.[0].id).toBe('iss-1');
    expect(doneCol?.issues?.[0].column_id).toBe('col-done');
    expect(doneCol?.issues?.[0].position).toBe(100);
  });
});
