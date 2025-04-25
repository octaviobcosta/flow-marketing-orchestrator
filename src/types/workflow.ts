
export interface User {
  id: string;
  name: string;
  email: string;
  position: string; // Cargo
  whatsapp?: string;
  managerId?: string; // Gestor direto
  avatar?: string;
}

export interface BlockType {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface WorkflowBlock {
  id: string;
  type: string;
  label: string;
  description: string;
  role: string; // Cargo/papel responsável
  assignedUserId?: string; // Usuário específico responsável
  sla: number; // Em horas
  status?: 'todo' | 'in-progress' | 'completed' | 'blocked';
  dependencies: string[]; // IDs dos blocos que este depende
  actions: ('approve' | 'reject' | 'comment' | 'upload' | 'return')[];
  position: {
    x: number;
    y: number;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  blocks: WorkflowBlock[];
  connections: WorkflowConnection[];
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  animated?: boolean;
  label?: string;
}

export interface TaskBlock {
  id: string;
  blockId: string; // Referência ao bloco do workflow
  taskId: string; // ID da tarefa relacionada
  status: 'waiting' | 'in-progress' | 'completed' | 'rejected' | 'returned';
  assignedUserId: string;
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
  comments: TaskComment[];
  attachments: TaskAttachment[];
  actions: TaskAction[];
}

export interface TaskComment {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface TaskAttachment {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  timestamp: string;
}

export interface TaskAction {
  id: string;
  userId: string;
  action: 'approve' | 'reject' | 'comment' | 'upload' | 'return';
  timestamp: string;
  comment?: string;
}
