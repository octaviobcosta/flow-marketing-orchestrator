
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

// Create an Axios instance
export const api = axios.create({
  baseURL: 'http://localhost:8000', // This will be replaced with VITE_API_URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eshows_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with a status code outside of 2xx
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('eshows_token');
        window.location.href = '/';
        toast({
          variant: "destructive",
          title: "Sessão expirada",
          description: "Sua sessão expirou. Por favor, faça login novamente.",
        });
      } else if (status === 403) {
        // Forbidden
        toast({
          variant: "destructive",
          title: "Acesso negado",
          description: data.message || "Você não tem permissão para acessar este recurso.",
        });
      } else if (status === 404) {
        // Not Found
        toast({
          variant: "destructive",
          title: "Recurso não encontrado",
          description: data.message || "O recurso solicitado não foi encontrado.",
        });
      } else if (status === 422 || status === 400) {
        // Validation errors
        toast({
          variant: "destructive",
          title: "Erro de validação",
          description: data.message || "Verifique os dados fornecidos.",
        });
      } else {
        // Generic error
        toast({
          variant: "destructive",
          title: "Erro",
          description: data.message || "Ocorreu um erro ao processar sua solicitação.",
        });
      }
    } else if (error.request) {
      // Request made but no response received
      toast({
        variant: "destructive",
        title: "Erro de comunicação",
        description: "Não foi possível se conectar ao servidor. Verifique sua conexão.",
      });
    } else {
      // Something happened in setting up the request
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao fazer a requisição.",
      });
    }
    
    return Promise.reject(error);
  }
);

// Mock API endpoints for development (will be removed in production)
export const mockAPI = {
  login: (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },
  getProfile: () => {
    return api.get('/auth/profile');
  },
  getTasks: (params?: any) => {
    return api.get('/tasks', { params });
  },
  getTask: (id: string) => {
    return api.get(`/tasks/${id}`);
  },
  createTask: (data: any) => {
    return api.post('/tasks', data);
  },
  updateTask: (id: string, data: any) => {
    return api.put(`/tasks/${id}`, data);
  },
  deleteTask: (id: string) => {
    return api.delete(`/tasks/${id}`);
  },
  updateTaskStatus: (id: string, status: string) => {
    return api.patch(`/tasks/${id}/status`, { status });
  },
  addComment: (taskId: string, comment: string) => {
    return api.post(`/tasks/${taskId}/comments`, { text: comment });
  },
  getWorkflows: () => {
    return api.get('/workflows');
  },
  getWorkflow: (id: string) => {
    return api.get(`/workflows/${id}`);
  },
  createWorkflow: (data: any) => {
    return api.post('/workflows', data);
  },
  updateWorkflow: (id: string, data: any) => {
    return api.put(`/workflows/${id}`, data);
  },
  deleteWorkflow: (id: string) => {
    return api.delete(`/workflows/${id}`);
  },
  applyWorkflow: (taskId: string, workflowId: string) => {
    return api.post(`/tasks/${taskId}/apply-workflow/${workflowId}`);
  },
  updateStepStatus: (taskId: string, stepId: string, status: string) => {
    return api.patch(`/tasks/${taskId}/steps/${stepId}/status`, { status });
  },
  getDashboardMetrics: () => {
    return api.get('/metrics/dashboard');
  },
  getOKRs: (period?: string) => {
    return api.get('/metrics/okrs', { params: { period } });
  },
  getTasksMetrics: (params?: any) => {
    return api.get('/metrics/tasks', { params });
  }
};
