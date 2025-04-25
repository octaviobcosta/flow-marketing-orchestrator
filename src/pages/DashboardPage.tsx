
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { ChevronRight, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardMetrics {
  summaryCards: {
    totalTasks: number;
    completedTasks: number;
    pendingApprovals: number;
    overdueItems: number;
  };
  okrs: Array<{
    id: number;
    title: string;
    progress: number;
    current: number;
    target: number;
    unit?: string;
    currency?: string;
  }>;
  recentTasks: Array<{
    id: number;
    title: string;
    status: string;
    dueDate: string;
    priority: string;
  }>;
  tasksByStatus: Array<{
    name: string;
    value: number;
  }>;
  timelineData: Array<{
    month: string;
    completed: number;
    created: number;
  }>;
}

const statusColors = {
  'pending': '#e5e7eb',
  'in_progress': '#93c5fd',
  'in_review': '#fcd34d',
  'completed': '#86efac',
  'cancelled': '#fca5a5',
};

const DashboardPage = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // In real implementation, this would be a call to the actual API
        // const response = await mockAPI.getDashboardMetrics();
        // setMetrics(response.data);
        
        // Mock data for demonstration
        const mockData: DashboardMetrics = {
          summaryCards: {
            totalTasks: 142,
            completedTasks: 98,
            pendingApprovals: 23,
            overdueItems: 7,
          },
          okrs: [
            {
              id: 1,
              title: "Aumentar receita de mídia social",
              progress: 85.1,
              current: 880600,
              target: 1040000,
              currency: "R$",
              unit: "mil"
            },
            {
              id: 2,
              title: "Expandir alcance nas redes",
              progress: 67.8,
              current: 1526,
              target: 2250,
              unit: "mil"
            }
          ],
          recentTasks: [
            {
              id: 1001,
              title: "Preparar campanha Landing Page Black Friday",
              status: "in_progress",
              dueDate: "2025-05-02",
              priority: "high"
            },
            {
              id: 1002,
              title: "Revisar assets para Instagram",
              status: "pending",
              dueDate: "2025-05-03",
              priority: "medium"
            },
            {
              id: 1003,
              title: "Aprovar mídia para TV - Q2",
              status: "in_review",
              dueDate: "2025-04-28",
              priority: "high"
            },
            {
              id: 1004,
              title: "Finalizar copy newsletter semanal",
              status: "completed",
              dueDate: "2025-04-24",
              priority: "medium"
            }
          ],
          tasksByStatus: [
            { name: "Pendente", value: 38 },
            { name: "Em Progresso", value: 45 },
            { name: "Em Revisão", value: 26 },
            { name: "Concluído", value: 98 },
            { name: "Cancelado", value: 12 }
          ],
          timelineData: [
            { month: "Jan", completed: 12, created: 18 },
            { month: "Fev", completed: 15, created: 20 },
            { month: "Mar", completed: 20, created: 22 },
            { month: "Abr", completed: 25, created: 30 },
            { month: "Mai", completed: 0, created: 15 },
            { month: "Jun", completed: 0, created: 0 }
          ]
        };
        
        setMetrics(mockData);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os dados do dashboard.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value: number, currency = "R$") => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency === "R$" ? "BRL" : "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatCompactNumber = (value: number, unit = "") => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ${unit}`.trim();
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K ${unit}`.trim();
    }
    return `${value} ${unit}`.trim();
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || '#e5e7eb';
  };
  
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader className="h-8 w-8 animate-spin text-eshows-orange mb-2" />
            <p className="text-gray-500">Carregando dados do dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral da plataforma de orquestração de marketing.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Tarefas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.summaryCards.totalTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tarefas Concluídas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics?.summaryCards.completedTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aprovações Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{metrics?.summaryCards.pendingApprovals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Itens Atrasados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{metrics?.summaryCards.overdueItems}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* OKRs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>OKRs - Q2 2025</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/metrics/okrs')}>
                  Ver todos
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Objetivos e resultados-chave
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {metrics?.okrs.map((okr) => (
                  <div key={okr.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{okr.title}</div>
                      <div className="text-sm font-medium">
                        {okr.progress}%
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-eshows-orange to-eshows-amber"
                        style={{ width: `${okr.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div>
                        {okr.currency 
                          ? formatCurrency(okr.current, okr.currency) 
                          : formatCompactNumber(okr.current, okr.unit)}
                      </div>
                      <div>
                        Meta: {okr.currency 
                          ? formatCurrency(okr.target, okr.currency) 
                          : formatCompactNumber(okr.target, okr.unit)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tasks by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status das Tarefas</CardTitle>
              <CardDescription>
                Distribuição de tarefas por status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics?.tasksByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {metrics?.tasksByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} tarefas`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tarefas por Mês</CardTitle>
              <CardDescription>
                Criadas vs. concluídas ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics?.timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="created" 
                      name="Criadas"
                      stroke="#f97316" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      name="Concluídas"
                      stroke="#10b981" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>Tarefas Recentes</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>
                  Ver todas
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.recentTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getStatusColor(task.status) }}
                      />
                      <div className="font-medium">{task.title}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
