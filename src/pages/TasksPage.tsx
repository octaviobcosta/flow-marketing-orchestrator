
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  MoreVertical,
  Loader2,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockAPI } from "@/services/api";

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee: {
    id: number;
    name: string;
    avatar?: string;
  };
  creator: {
    id: number;
    name: string;
  };
}

interface TasksResponse {
  items: Task[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "pending", label: "Pendente" },
  { value: "in_progress", label: "Em progresso" },
  { value: "in_review", label: "Em revisão" },
  { value: "completed", label: "Concluído" },
  { value: "cancelled", label: "Cancelado" },
];

const priorityOptions = [
  { value: "all", label: "Todas as Prioridades" },
  { value: "high", label: "Alta" },
  { value: "medium", label: "Média" },
  { value: "low", label: "Baixa" },
];

const TasksPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    sort: "dueDate",
    order: "asc",
  });

  useEffect(() => {
    fetchTasks();
  }, [pagination.page, filters]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      
      // In real implementation, this would call the API with filters
      // const response = await mockAPI.getTasks({
      //   page: pagination.page,
      //   limit: pagination.limit,
      //   ...filters
      // });
      
      // Mock data for demonstration
      const mockTasks: Task[] = [
        {
          id: 1001,
          title: "Preparar campanha Landing Page Black Friday",
          status: "in_progress",
          priority: "high",
          dueDate: "2025-05-02",
          assignee: {
            id: 1,
            name: "Ana Silva",
          },
          creator: {
            id: 2,
            name: "Carlos Mendes",
          },
        },
        {
          id: 1002,
          title: "Revisar assets para Instagram",
          status: "pending",
          priority: "medium",
          dueDate: "2025-05-03",
          assignee: {
            id: 3,
            name: "Julia Costa",
          },
          creator: {
            id: 2,
            name: "Carlos Mendes",
          },
        },
        {
          id: 1003,
          title: "Aprovar mídia para TV - Q2",
          status: "in_review",
          priority: "high",
          dueDate: "2025-04-28",
          assignee: {
            id: 4,
            name: "Marcelo Santos",
          },
          creator: {
            id: 5,
            name: "Patricia Almeida",
          },
        },
        {
          id: 1004,
          title: "Finalizar copy newsletter semanal",
          status: "completed",
          priority: "medium",
          dueDate: "2025-04-24",
          assignee: {
            id: 3,
            name: "Julia Costa",
          },
          creator: {
            id: 2,
            name: "Carlos Mendes",
          },
        },
        {
          id: 1005,
          title: "Planejar conteúdo para TikTok",
          status: "pending",
          priority: "medium",
          dueDate: "2025-05-07",
          assignee: {
            id: 6,
            name: "Roberto Lima",
          },
          creator: {
            id: 5,
            name: "Patricia Almeida",
          },
        },
      ];

      const mockResponse: TasksResponse = {
        items: mockTasks,
        total: 42,
        page: pagination.page,
        pages: 5,
        limit: pagination.limit,
      };

      setTasks(mockResponse.items);
      setPagination({
        ...pagination,
        total: mockResponse.total,
        pages: mockResponse.pages,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as tarefas.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination({
      ...pagination,
      page: newPage,
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({
      ...filters,
      [key]: value,
    });
    setPagination({
      ...pagination,
      page: 1, // Reset to first page when changing filters
    });
  };

  const handleSort = (column: string) => {
    const newOrder = filters.sort === column && filters.order === "asc" ? "desc" : "asc";
    setFilters({
      ...filters,
      sort: column,
      order: newOrder,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  const handleCreateTask = () => {
    navigate("/tasks/new");
  };

  const handleTaskClick = (taskId: number) => {
    navigate(`/tasks/${taskId}`);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "bg-gray-100 text-gray-800",
      in_progress: "bg-blue-100 text-blue-800",
      in_review: "bg-amber-100 text-amber-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    const statusLabels = {
      pending: "Pendente",
      in_progress: "Em progresso",
      in_review: "Em revisão",
      completed: "Concluído",
      cancelled: "Cancelado",
    };

    const style = statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800";
    const label = statusLabels[status as keyof typeof statusLabels] || status;

    return <Badge className={style}>{label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityStyles = {
      high: "bg-red-100 text-red-800",
      medium: "bg-amber-100 text-amber-800",
      low: "bg-green-100 text-green-800",
    };

    const priorityLabels = {
      high: "Alta",
      medium: "Média",
      low: "Baixa",
    };

    const style = priorityStyles[priority as keyof typeof priorityStyles] || "bg-gray-100 text-gray-800";
    const label = priorityLabels[priority as keyof typeof priorityLabels] || priority;

    return <Badge className={style}>{label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
            <p className="text-muted-foreground">
              Gerencie suas tarefas de marketing e acompanhe seu progresso.
            </p>
          </div>
          <Button onClick={handleCreateTask}>
            <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar tarefas..."
                    className="pl-10"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                  />
                </div>
              </form>
              <div className="flex gap-2">
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.priority}
                  onValueChange={(value) => handleFilterChange("priority", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("dueDate")}
                >
                  Data de Entrega
                  {filters.sort === "dueDate" && (
                    <span className="ml-1">
                      {filters.order === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhuma tarefa encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleTaskClick(task.id)}
                  >
                    <TableCell className="font-medium">
                      {task.title}
                    </TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell>{formatDate(task.dueDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-eshows-amber text-white flex items-center justify-center text-sm">
                          {task.assignee.name.split(" ").map(name => name[0]).join("").slice(0, 2)}
                        </div>
                        <span>{task.assignee.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tasks/${task.id}`);
                          }}>
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tasks/${task.id}/edit`);
                          }}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              // Delete task logic
                              toast({
                                title: "Tarefa excluída",
                                description: `A tarefa ${task.id} foi excluída.`,
                              });
                            }}
                            className="text-red-600"
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {tasks.length} de {pagination.total} resultados
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">
                Página {pagination.page} de {pagination.pages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TasksPage;
