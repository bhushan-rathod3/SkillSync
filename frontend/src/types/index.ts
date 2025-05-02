// User Types
export enum UserRole {
  CLIENT = "client",
  FREELANCER = "freelancer",
  ADMIN = "admin",
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  profileImage?: string;
  projects?: Project[];
  bids?: Bid[];
  sentMessages?: Message[];
  receivedMessages?: Message[];
  files?: File[];
  userSkills?: UserSkill[];
}

// Project Types
export enum ProjectStatus {
  OPEN = "open",
  ASSIGNED = "assigned",
  COMPLETED = "completed",
}

export interface Project {
  id: number;
  client: User;
  assignedFreelancer?: User;
  title: string;
  category: string;
  description: string;
  budget: number;
  deadline: Date;
  status: ProjectStatus;
  bids?: Bid[];
  milestones?: Milestone[];
  messages?: Message[];
  files?: File[];
  createdAt: Date;
}

// Bid Types
export enum BidStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface Bid {
  id: number;
  project: Project;
  projectId: number;
  freelancer: User;
  freelancerId: number;
  bidAmount: number;
  durationDays: number;
  bidMessage: string;
  status: BidStatus;
  createdAt: Date;
}

// Message Types
export interface Message {
  id: number;
  project: Project;
  sender: User;
  receiver: User;
  message: string;
  attachment?: File;
  attachmentUrl?: string;
  createdAt: Date;
}

// File Types
export interface File {
  id: number;
  uploader: User;
  uploaderId?: number;
  project: Project;
  projectId?: number;
  fileUrl: string;
  fileType: string;
  createdAt: Date;
}

// Skill Types
export interface Skill {
  id: number;
  name: string;
  userSkills?: UserSkill[];
}

export interface UserSkill {
  id: number;
  user: User;
  skill: Skill;
}

// Milestone Types
export interface Milestone {
  id: number;
  project: Project;
  title: string;
  dueDate: Date;
  amount: number;
  isPaid: boolean;
  invoice?: Invoice;
}

// Invoice Types
export interface Invoice {
  id: number;
  milestone: Milestone;
  invoiceNumber: string;
  amount: number;
  status: string; // 'paid' | 'unpaid'
  createdAt: Date;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  bio?: string;
  skills?: string[];
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

// DTO Types for Create/Update Operations
export interface CreateProjectDto {
  title: string;
  category: string;
  description: string;
  budget: number;
  deadline: Date;
}

export interface UpdateProjectDto {
  title?: string;
  category?: string;
  description?: string;
  budget?: number;
  deadline?: Date;
  status?: ProjectStatus;
  assignedFreelancerId?: number;
}

export interface CreateBidDto {
  projectId: number;
  bidAmount: number;
  durationDays: number;
  bidMessage: string;
}

export interface UpdateBidDto {
  bidAmount?: number;
  durationDays?: number;
  bidMessage?: string;
  status?: BidStatus;
}

export interface ApproveBidDto {
  status: BidStatus;
}

export interface CreateMessageDto {
  projectId: number;
  receiverId: number;
  message: string;
  attachment?: File;
}

export interface UpdateMessageDto {
  message?: string;
  attachment?: File;
}

export interface CreateMilestoneDto {
  projectId: number;
  title: string;
  dueDate: Date;
  amount: number;
}

export interface UpdateMilestoneDto {
  title?: string;
  dueDate?: Date;
  amount?: number;
  isPaid?: boolean;
}

export interface CreateInvoiceDto {
  milestoneId: number;
  invoiceNumber: string;
  amount: number;
}

export interface UpdateInvoiceDto {
  status?: string;
}

export interface CreateSkillDto {
  name: string;
}

export interface UpdateUserDto {
  name?: string;
  bio?: string;
  profileImage?: string;
}

export interface CreateFileDto {
  projectId?: number;
  fileUrl: string;
  fileType: string;
}

export interface UpdateFileDto {
  fileUrl?: string;
  fileType?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
