import { Task, User, TaskAssignment, HistoryEntry } from './task.model';

describe('Task Model', () => {
  it('should create a task object with required properties', () => {
    const task: Task = {
      id: 1,
      title: 'Test Task',
      description: 'This is a test task',
      status: 'TODO',
      priority: 'MEDIUM'
    };

    expect(task).toBeDefined();
    expect(task.id).toBe(1);
    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('This is a test task');
    expect(task.status).toBe('TODO');
    expect(task.priority).toBe('MEDIUM');
  });

  it('should create a task object with all properties', () => {
    const user: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      createdAt: '2023-01-01T00:00:00'
    };

    const assignment: TaskAssignment = {
      id: 1,
      user: user
    };

    const historyEntry: HistoryEntry = {
      id: 1,
      fieldChanged: 'status',
      oldValue: 'TODO',
      newValue: 'IN_PROGRESS',
      changedAt: '2023-01-02T00:00:00',
      user: user
    };

    const task: Task = {
      id: 1,
      title: 'Test Task',
      description: 'This is a test task',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: '2023-01-10T00:00:00',
      endDate: '2023-01-08T00:00:00',
      createdAt: '2023-01-01T00:00:00',
      updatedAt: '2023-01-02T00:00:00',
      assignments: [assignment],
      history: [historyEntry]
    };

    expect(task).toBeDefined();
    expect(task.dueDate).toBe('2023-01-10T00:00:00');
    expect(task.endDate).toBe('2023-01-08T00:00:00');
    expect(task.createdAt).toBe('2023-01-01T00:00:00');
    expect(task.updatedAt).toBe('2023-01-02T00:00:00');
    expect(task.assignments?.length).toBe(1);
    expect(task.assignments?.[0].user.username).toBe('testuser');
    expect(task.history?.length).toBe(1);
    expect(task.history?.[0].fieldChanged).toBe('status');
  });

  it('should validate task status values', () => {
    const validStatuses: Array<'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'RETRO' | 'DONE'> = [
      'BACKLOG', 'TODO', 'IN_PROGRESS', 'RETRO', 'DONE'
    ];

    validStatuses.forEach(status => {
      const task: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Description',
        status: status,
        priority: 'MEDIUM'
      };
      expect(task.status).toBe(status);
    });
  });

  it('should validate task priority values', () => {
    const validPriorities: Array<'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'> = [
      'VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'
    ];

    validPriorities.forEach(priority => {
      const task: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Description',
        status: 'TODO',
        priority: priority
      };
      expect(task.priority).toBe(priority);
    });
  });
});
