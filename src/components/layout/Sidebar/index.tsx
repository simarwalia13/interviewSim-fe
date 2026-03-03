import Link from 'next/link';
import type { ReactNode } from 'react';
import { FaCalendarCheck } from 'react-icons/fa';
import { MdTask, MdTimeline, MdWork } from 'react-icons/md';

type SidebarLayoutProps = {
  children: ReactNode;
};

const Sidebar = ({ children }: SidebarLayoutProps) => {
  const navItems = [
    {
      id: 1,
      icon: <MdTimeline className='h-5 w-5' />,
      url: '/Interview/stats',
      altTitle: 'Interview Stats',
    },
    {
      id: 2,
      icon: <MdWork className='h-5 w-5' />,
      url: '/feed',
      altTitle: 'Feed',
    },
    {
      id: 3,
      icon: <MdTask className='h-5 w-5' />,
      url: '/Interview',
      altTitle: 'Interview Questions',
    },
    {
      id: 4,
      icon: <FaCalendarCheck className='h-5 w-5' />,
      url: '/Interview/Preparation',
      altTitle: 'Interview Preparation',
    },
  ];

  return (
    <div className='flex min-h-screen border-2 border-black bg-white'>
      {/* Sidebar */}
      <aside className='fixed z-10 flex h-screen w-48 flex-col border-r border-gray-200 bg-white p-6'>
        {/* Logo */}
        <div className='mb-10'>
          <Link href='/' className='flex items-center space-x-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600'>
              <span className='text-lg font-bold text-white'>I</span>
            </div>
            <span className='text-xl font-bold text-gray-900'>Interview</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className='flex-1 space-y-2'>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className='flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 transition-all hover:bg-gray-100 hover:text-blue-600'
            >
              <div className='text-gray-500'>{item.icon}</div>
              <span className='font-medium'>{item.altTitle}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile (Optional) */}
        <div className='mt-auto border-t border-gray-200 pt-6'>
          <div className='flex items-center space-x-3'>
            <div className='h-9 w-9 rounded-full bg-gray-300'></div>
            <div>
              <p className='font-medium text-gray-900'>John Doe</p>
              <p className='text-sm text-gray-500'>Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className='ml-64 flex-1 bg-gray-50'>{children}</main>
    </div>
  );
};

export default Sidebar;
