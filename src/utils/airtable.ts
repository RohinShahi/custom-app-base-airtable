import { need } from '@/utils/need';
import Airtable, { FieldSet, Records } from 'airtable';

export interface Task {
  'Task ID': string;
  'Company ID': string;
  'Task Name': string;
  Description: string;
  Status: 'Todo' | 'In progress' | 'Done'; 
  Deadline: string;
}

const COMPANY_ID_TO_TEST = '456';
const BASE_ID = 'appqZYCmKXwCuQh6l';
const TABLE_ID = 'tblfgNyhphg1Oi2k1';


export async function getTasksByCompanyId(companyId: string | undefined): Promise<Task[]> {
  const AIRTABLE_API_KEY = need<string>(
    process.env.AIRTABLE_API_KEY,
    'AIRTABLE_API_KEY is required :(',
  );
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID);

  try {
    const records: Records<FieldSet> = await base(TABLE_ID)
      .select({
        filterByFormula: `({Company ID} = '${companyId ?? COMPANY_ID_TO_TEST}')`,
      })
      .all();

    const tasks = records.map((record) => {
      const status = record.get('Status') as string;
      let normalizedStatus: 'Todo' | 'In progress' | 'Done';
      switch (status.toLowerCase()) {
        case 'todo':
          normalizedStatus = 'Todo';
          break;
        case 'in progress':
          normalizedStatus = 'In progress';
          break;
        case 'done':
          normalizedStatus = 'Done';
          break;
        default:
          normalizedStatus = 'Todo';
      }

      return {
        'Task ID': record.id,
        'Company ID': record.get('Company ID') as string,
        'Task Name': record.get('Task Name') as string,
        Description: record.get('Description') as string,
        Status: normalizedStatus,
        Deadline: record.get('Deadline') as string,
      };
    }) as Task[];

    console.log('Fetched Tasks:', tasks); // Add this line for debugging
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export async function updateTaskStatus(taskId: string, status: Task['Status']): Promise<Task> {
  const AIRTABLE_API_KEY = "pat1i5uoWewnWQSge.5d7cfacd31f07d2d4e7bc757d7c4aa10f34c012d8588df1eb935e80b198e28c0";
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