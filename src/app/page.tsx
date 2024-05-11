import { TokenGate } from '@/components/TokenGate';
import { getTasksByCompanyId } from '@/utils/airtable';
import { getSession } from '@/utils/session';
import Image from 'next/image';
import './styles.css';
import TaskList from '@/components/TaskList';

async function Content({ searchParams }: { searchParams: SearchParams }) {
  try {
    const data = await getSession(searchParams);
    const tasks = await getTasksByCompanyId(data.company?.id);

    console.log(data);

    return (
      <main className="main">
        <div className="header">
          <p>
            Welcome to the Airtable Wrapper&nbsp;
          </p>
          <div className="footer">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              href="https://copilot.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{' '}
              <Image
                src="/copilot_icon.png"
                alt="Copilot Icon"
                className="dark:invert"
                width={24}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <TaskList initialTasks={tasks} />
      </main>
    );
  } catch (error) {
    console.error('Error in Content component:', error);
    return (
      <main className="main">
        <p>Error loading tasks. Womp womp.</p>
      </main>
    );
  }
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <TokenGate searchParams={searchParams}>
      <Content searchParams={searchParams} />
    </TokenGate>
  );
}
