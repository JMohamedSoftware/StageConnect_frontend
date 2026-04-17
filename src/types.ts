// Types partagés dans toute l'application

export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "company" | "admin";
  is_approved?: boolean;
  cv_url?: string;
  phone?: string;
  company_name?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

export interface Offer {
  id: number;
  title: string;
  company_name: string;
  location: string;
  duration: string;
  description?: string;
  requirements?: string;
  status?: string;
  contractType?: string;
}

export interface Application {
  id: number;
  offer_title: string;
  company_name: string;
  student_name?: string;
  student_cv?: string;
  status: "pending" | "accepted" | "rejected";
  applied_at: string;
}
