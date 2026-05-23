'use client';

import { Course } from '@/lib/types';
import { ShieldAlert } from 'lucide-react';

type Props = {
  course: Course;
  enrolled: boolean;
  loading: boolean;
  onEnroll: () => void;
};

export default function CourseCard({ course, enrolled, loading, onEnroll }: Props) {

  const iconClass = enrolled ? 'h-5 w-5' : 'h-6 w-6';

  return (
    <div className="rounded-xl border border-zinc-200 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-zinc-700">{course.title}</h3>
          <p className="text-zinc-600">{course.description}</p>
        </div>
        {course.required && (
          <span className={`gap-2 flex items-center rounded-full  px-3 py-1 text-sm font-medium 
          ${enrolled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700 animate-bounce'}
          `}>
            <ShieldAlert className={iconClass} />
            Обов&apos;язковий
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-zinc-500">{course.duration}</div>
        <button
          disabled={enrolled || loading}
          onClick={onEnroll}
          className={`rounded px-4 py-2 text-sm font-semibold ${
            enrolled ? 'bg-zinc-200 text-zinc-500' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {enrolled ? 'Вже записаний' : loading ? 'Зачекайте...' : 'Записатись'}
        </button>
      </div>
    </div>
  );
}