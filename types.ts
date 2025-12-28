
export enum AgentMode {
  CODER = 'Coder',
  DEBUGGER = 'Debugger',
  REVIEWER = 'Reviewer',
  SUPERVISOR = 'Supervisor',
  PERFORMANCE = 'Performance',
  SECURITY = 'Security',
  ANSWERER = 'Answerer',
  CRITIC = 'Critic',
  ARCHITECT = 'Architect'
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
}

export interface AgentHistoryItem {
  id: string;
  mode: AgentMode;
  input: string;
  output: string;
  timestamp: number;
  confidence?: number;
}

export interface User {
  fullName: string;
  email: string;
  mobile: string;
  isLoggedIn: boolean;
}

export interface AuthState {
  view: 'login' | 'register' | 'forgot' | 'otp';
  tempUser?: Partial<User>;
}
