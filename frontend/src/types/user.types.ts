import { UserRole } from "./auth.types";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  bio: string | null;
  profileImage: string;
  skills: string[];
}

export interface UpdateProfilePayload {
  bio?: string;
  profileImage?: string;
  skills?: string[];
}
