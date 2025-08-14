export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'staff' | 'admin';
  rollNo?: string;
  idNo?: string;
  department: string;
  studyYear?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  imageUrl?: string;
  createdBy: string;
  createdByName: string;
  createdByRole: 'student' | 'staff';
  status: 'pending' | 'approved' | 'rejected';
  maxParticipants?: number;
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'student' | 'staff';
  department: string;
  rollNo?: string;
  idNo?: string;
  registeredAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}