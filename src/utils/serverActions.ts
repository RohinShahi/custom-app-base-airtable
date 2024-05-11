import { need } from '@/utils/need';
import Airtable from 'airtable';

export interface Task {
  'Task ID': string;
  'Company ID': string;
  'Task Name': string;
  Description: string;
  Status: 'Todo' | 'In progress' | 'Done'; 
  Deadline: string;
}

const BASE_ID = 'appqZYCmKXwCuQh6l';
const TABLE_ID = 'tblfgNyhphg1Oi2k1';

export async function updateTaskStatus(taskId: string, status: Task['Status']): Promise<Task> {
  const AIRTABLE_API_KEY = need<string>(
    process.env.AIRTABLE_API_KEY,
    'AIRTABLE_API_KEY is required :(',
  );
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID);

  try {
    const record = await base(TABLE_ID).update(taskId, {
      Status: status,
    });

    return {
      'Task ID': record.id,
      'Company ID': record.get('Company ID') as string,
      'Task Name': record.get('Task Name') as string,
      Description: record.get('Description') as string,
      Status: record.get('Status') as 'Todo' | 'In progress' | 'Done',
      Deadline: record.get('Deadline') as string,
    } as Task;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
}
