
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import {
  Users,
  Settings,
  PlusCircle,
  Pencil,
  Trash2,
  Save,
  User,
  Phone,
  Mail,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mockAPI } from "@/services/api";
import { User as UserType } from "@/types/workflow";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProjectSettingsPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [projectName, setProjectName] = useState("Marketing Hub");
  const [projectDesc, setProjectDesc] = useState("Plataforma central para gerenciamento de conteúdo de marketing.");
  const [users, setUsers] = useState<UserType[]>([]);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  
  // Form fields for user
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPosition, setFormPosition] = useState("");
  const [formWhatsapp, setFormWhatsapp] = useState("");
  const [formManager, setFormManager] = useState("");
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    
    // Usando dados mockados para demonstração
    const mockUsers: UserType[] = [
      {
        id: "user-1",
        name: "João Silva",
        email: "joao.silva@example.com",
        position: "Designer",
        whatsapp: "11999887766",
        managerId: "user-3",
        avatar: "https://i.pravatar.cc/150?u=user1",
      },
      {
        id: "user-2",
        name: "Maria Oliveira",
        email: "maria.oliveira@example.com",
        position: "Copywriter",
        whatsapp: "11988776655",
        managerId: "user-3",
        avatar: "https://i.pravatar.cc/150?u=user2",
      },
      {
        id: "user-3",
        name: "Carlos Mendes",
        email: "carlos.mendes@example.com",
        position: "Marketing Manager",
        whatsapp: "11977665544",
        avatar: "https://i.pravatar.cc/150?u=user3",
      },
      {
        id: "user-4",
        name: "Ana Luiza",
        email: "ana.luiza@example.com",
        position: "Social Media",
        whatsapp: "11966554433",
        managerId: "user-3",
        avatar: "https://i.pravatar.cc/150?u=user4",
      },
      {
        id: "user-demo-123",
        name: "Usuário Demonstração",
        email: "demo@eshows.com",
        position: "Admin",
        avatar: "https://i.pravatar.cc/150?u=demo",
      },
    ];
    
    setUsers(mockUsers);
    setIsLoading(false);
  };
  
  const handleCreateUser = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormPosition("");
    setFormWhatsapp("");
    setFormManager("");
    setIsUserDialogOpen(true);
  };
  
  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPosition(user.position);
    setFormWhatsapp(user.whatsapp || "");
    setFormManager(user.managerId || "");
    setIsUserDialogOpen(true);
  };
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido com sucesso.",
    });
  };
  
  const handleSaveUser = () => {
    if (!formName || !formEmail || !formPosition) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
      });
      return;
    }
    
    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: formName,
                email: formEmail,
                position: formPosition,
                whatsapp: formWhatsapp,
                managerId: formManager || undefined,
              }
            : u
        )
      );
      
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });
    } else {
      // Create new user
      const newUser: UserType = {
        id: `user-${Date.now()}`,
        name: formName,
        email: formEmail,
        position: formPosition,
        whatsapp: formWhatsapp || undefined,
        managerId: formManager || undefined,
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      };
      
      setUsers([...users, newUser]);
      
      toast({
        title: "Usuário criado",
        description: "O novo usuário foi criado com sucesso.",
      });
    }
    
    setIsUserDialogOpen(false);
  };
  
  const handleSaveProjectSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações do projeto foram salvas com sucesso.",
    });
  };
  
  const getManagerName = (managerId: string | undefined) => {
    if (!managerId) return "Não definido";
    const manager = users.find((u) => u.id === managerId);
    return manager ? manager.name : "Não encontrado";
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Configurações do Projeto</h1>
            <p className="text-muted-foreground">
              Gerencie as configurações e usuários do seu projeto.
            </p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
                <CardDescription>
                  Configure as informações básicas do seu projeto.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Nome do Projeto</Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project-desc">Descrição</Label>
                  <Textarea
                    id="project-desc"
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <Button onClick={handleSaveProjectSettings} className="mt-4">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Usuários</CardTitle>
                  <CardDescription>
                    Gerencie os usuários que têm acesso ao projeto.
                  </CardDescription>
                </div>
                <Button onClick={handleCreateUser}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Novo Usuário
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Gestor</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-full h-full p-1 text-gray-500" />
                            )}
                          </div>
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.position}</TableCell>
                        <TableCell>
                          {user.whatsapp || "Não informado"}
                        </TableCell>
                        <TableCell>
                          {getManagerName(user.managerId)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-500"
                              disabled={user.id === "user-demo-123" || user.id === user?.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Editar Usuário" : "Novo Usuário"}
              </DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Edite as informações do usuário existente."
                  : "Preencha as informações para criar um novo usuário."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user-name" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Nome Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="user-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Nome completo do usuário"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-email" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="user-email"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-position" className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  Cargo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="user-position"
                  value={formPosition}
                  onChange={(e) => setFormPosition(e.target.value)}
                  placeholder="Cargo do usuário"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-whatsapp" className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </Label>
                <Input
                  id="user-whatsapp"
                  type="tel"
                  value={formWhatsapp}
                  onChange={(e) => setFormWhatsapp(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-manager" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Gestor Direto
                </Label>
                <Select
                  value={formManager}
                  onValueChange={setFormManager}
                >
                  <SelectTrigger id="user-manager">
                    <SelectValue placeholder="Selecione um gestor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sem gestor</SelectItem>
                    {users
                      .filter((u) => u.id !== (editingUser?.id || ""))
                      .map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" onClick={handleSaveUser}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ProjectSettingsPage;
