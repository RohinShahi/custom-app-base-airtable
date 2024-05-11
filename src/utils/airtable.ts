import axios from 'axios';

export interface Task {
  'Task ID': string;
  'Company ID': string;
  'Task Name': string;
  Description: string;
  Status: 'Todo' | 'In progress' | 'Done'; 
  Priority: string;
  Deadline: string;
}

const BASE_URL = 'https://api.airtable.com/v0';
const BASE_ID = 'appqZYCmKXwCuQh6l';
const TABLE_ID = 'tblfgNyhphg1Oi2k1';
// On production apps, would obscure via .env.local
const API_KEY = "pat1i5uoWewnWQSge.5d7cfacd31f07d2d4e7bc757d7c4aa10f34c012d8588df1eb935e80b198e28c0";

export async function getTasksByCompanyId(companyId: string | undefined): Promise<Task[]> {
  try {
    const response = await axios.get(`${BASE_URL}/${BASE_ID}/${TABLE_ID}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      },
      params: {
        filterByFormula: `({Company ID} = '${companyId}')`
      }
    });
    
    // Repetitive, yes, but wanted to make sure through explicit typing
    const tasks = response.data.records.map((record: any) => ({
      'Task ID': record.id,
      'Company ID': record.fields['Company ID'],
      'Task Name': record.fields['Task Name'],
      Description: record.fields['Description'],
      Status: record.fields['Status'] as 'Todo' | 'In progress' | 'Done',
      Deadline: record.fields['Deadline'],
      Priority: record.fields['Priority']
    })) as Task[];

    console.log('Fetched Tasks:', tasks);
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export async function updateTaskStatus(taskId: string, status: Task['Status']): Promise<Task> {
  try {
    const response = await axios.patch(`${BASE_URL}/${BASE_ID}/${TABLE_ID}/${taskId}`, {
      fields: {
        Status: status
      }
    }, {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    });

    return {
      'Task ID': response.data.id,
      'Company ID': response.data.fields['Company ID'],
      'Task Name': response.data.fields['Task Name'],
      Description: response.data.fields['Description'],
      Status: response.data.fields['Status'] as 'Todo' | 'In progress' | 'Done',
      Deadline: response.data.fields['Deadline'],
      Priority: response.data.fields['Priority']
    } as Task;
  } catch (error) {
    console.error(`Error updating status for task ${taskId}:`, error);
    throw error;
  }
}
