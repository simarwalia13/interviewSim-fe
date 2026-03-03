import { useRouter } from 'next/router';

import type { ExamCategory } from '@/data/examData';

interface CategorySectionProps {
  category: ExamCategory;
}

const CategorySection = ({ category }: CategorySectionProps) => {
  const router = useRouter();
  return (
    <section className='mb-12'>
      <div className='mb-4'>
        <h2 className='text-foreground text-2xl md:text-3xl'>
          {category.title}
        </h2>
        <p className='text-muted-foreground mt-1 text-sm'>
          {category.description}
        </p>
      </div>
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {category.items.map((item) => (
          <button
            key={item}
            onClick={() => router.push(`/exam/${encodeURIComponent(item)}`)}
            className='bg-card border-border hover:border-primary/40 text-foreground/85 hover:text-primary cursor-pointer rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all duration-200 hover:shadow-sm'
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
