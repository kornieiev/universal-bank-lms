export type Course = {
  id: number;
  title: string;
  description?: string;
  duration?: string;
  required?: boolean;
};

export type EnrollmentItem = {
  course_id: number;
  title: string;
  progress: number;
  enrolled_at: string;
  completed_at: string | null;
};

export type AuthUser = {
  id: number;
  name: string;
  coins: number;
};

export type AuthResponse = {
  user: AuthUser;
  token: {
    token: string;
    refreshToken?: string;
  };
};

export type LeaderboardRow = {
  userId: number;
  rank: number;
  name: string;
  coins: number;
  courses_completed: number;
};

export type LeaderboardResponse = {
  data: LeaderboardRow[];
  current_user: {
    currentUserId: number;
    rank: number;
    coins: number;
    courses_completed: number;
  };
};
