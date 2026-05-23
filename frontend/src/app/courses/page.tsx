'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import { Course, EnrollmentItem, AuthUser } from '@/lib/types';
import { getCurrentUser, setCurrentUser } from '@/lib/auth';
import Header from '@/components/Header';
import CourseCard from '@/components/CourseCard';
import { useAuthRedirect } from '@/lib/useAuthRedirect';
import { BookOpenText } from 'lucide-react';

export default function CoursesPage() {
  useAuthRedirect();

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, userCourses] = await Promise.all([
          apiGet<Course[]>('/courses'),
          apiGet<EnrollmentItem[]>('/users/me/courses'),
        ]);
        setCourses(courseData);
        setEnrolledIds(new Set(userCourses.map((item) => item.course_id)));
      } catch (err) {
        setError((err as Error).message || 'Error loading courses');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEnroll = async (courseId: number) => {
    if (enrolledIds.has(courseId) || enrollingId === courseId) return;
    const prevCoins = user?.coins ?? 0;

    setEnrolledIds((prev) => new Set(prev).add(courseId));
    setEnrollingId(courseId);
    setUser((prev) => (prev ? { ...prev, coins: prev.coins + 10 } : prev));

    try {
      const response = await apiPost<{
        message: string;
        enrollment: { course_id: number; enrolled_at: string; progress: number };
        coins_earned: number;
        coins_total: number;
      }>(`/courses/${courseId}/enroll`, {});
      if (user) {
        const updatedUser = { ...user, coins: response.coins_total };
        setUser(updatedUser);
        setCurrentUser(updatedUser);
      }
    } catch (err) {
      setEnrolledIds((prev) => {
        const next = new Set(prev);
        next.delete(courseId);
        return next;
      });
      setUser((prev) => (prev ? { ...prev, coins: prevCoins } : prev));
      setError((err as Error).message || 'Enroll failed');
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) {
    return <div className="px-6 py-10">Loading courses...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <h1 className="mb-6 text-3xl flex items-center gap-4 font-semibold text-amber-400 group">
          <BookOpenText className="h-7 w-7 text-amber-500 transition-transform duration-300 [rotate:-20deg] group-hover:[rotate:0deg]" />
          Courses
        </h1>
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-red-700">{error}</div>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              enrolled={enrolledIds.has(course.id)}
              loading={enrollingId === course.id}
              onEnroll={() => handleEnroll(course.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}