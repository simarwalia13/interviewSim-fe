import { Search } from 'lucide-react';
import { useState } from 'react';

import { allCategories } from '@/data/examData';

import CategorySection from '@/components/CategorySection';

const DashboardPage = () => {
  const [search, setSearch] = useState('');

  const filtered = allCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div className='bg-background min-h-screen'>
      {/* Header */}
      <header className='border-border bg-background/80 sticky top-0 z-10 border-b backdrop-blur-md'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-4'>
          <h1 className='text-foreground text-xl tracking-tight md:text-2xl'>
            PrepHub<span className='text-accent'>.</span>
          </h1>
          <span className='text-muted-foreground hidden text-xs sm:block'>
            Your exam & interview preparation companion
          </span>
        </div>
      </header>

      <main className='mx-auto max-w-6xl px-4 py-8 md:py-12'>
        {/* Hero */}
        <div className='mb-10 md:mb-14'>
          <h2 className='text-foreground max-w-xl text-3xl leading-tight md:text-5xl'>
            Find your exam<span className='text-accent'>.</span>
            <br />
            Start preparing<span className='text-accent'>.</span>
          </h2>
          <p className='text-muted-foreground mt-3 max-w-md text-sm md:text-base'>
            Browse government, competitive & entrance exams along with job
            interview topics — all in one place.
          </p>

          {/* Search */}
          <div className='relative mt-6 max-w-md'>
            <Search className='text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2' />
            <input
              type='text'
              placeholder='Search exams or fields...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-primary/30 focus:border-primary/50 w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm transition-all focus:outline-none focus:ring-2'
            />
          </div>
        </div>

        {/* Categories */}
        {filtered.length > 0 ? (
          filtered.map((cat) => (
            <CategorySection key={cat.title} category={cat} />
          ))
        ) : (
          <p className='text-muted-foreground py-20 text-center'>
            No results found for "{search}"
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className='border-border mt-8 border-t'>
        <div className='text-muted-foreground mx-auto max-w-6xl px-4 py-6 text-center text-xs'>
          PrepHub — Exam & Interview Preparation Hub
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
