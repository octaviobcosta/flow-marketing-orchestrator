
import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CheckSquare,
  GitBranch,
  Settings,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface MainLayoutProps {
  children: ReactNode;
}

interface NavItem {
  title: string;
  href: string;
  icon: JSX.Element;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Tarefas",
      href: "/tasks",
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      title: "Workflows",
      href: "/workflow",
      icon: <GitBranch className="h-5 w-5" />,
    },
    {
      title: "Configurações",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Generate avatar fallback from user's name
  const getAvatarFallback = (name?: string) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="flex h-full min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="font-bold text-xl bg-gradient-to-r from-eshows-orange to-eshows-amber text-transparent bg-clip-text">
              Eshows
            </div>
            <div className="ml-2 font-medium text-gray-700">Marketing</div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={location.pathname === item.href ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                location.pathname === item.href
                  ? "bg-eshows-orange text-white hover:bg-eshows-orange/90"
                  : "text-gray-700"
              )}
              onClick={() => navigate(item.href)}
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </Button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Avatar className="h-7 w-7 mr-2">
                  {user?.avatar && <div className="bg-cover bg-center h-full w-full" style={{ backgroundImage: `url(${user.avatar})` }} />}
                  <AvatarFallback className="bg-eshows-amber text-white">
                    {getAvatarFallback(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{user?.name || "Usuário"}</span>
                  <span className="text-xs text-gray-500">{user?.role || "Membro"}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <div className="font-bold text-lg bg-gradient-to-r from-eshows-orange to-eshows-amber text-transparent bg-clip-text">
              Eshows
            </div>
            <div className="ml-1 font-medium text-gray-700 text-sm">Marketing</div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-gray-800/50">
          <div className="fixed right-0 top-0 h-full w-3/4 max-w-xs bg-white shadow-xl flex flex-col">
            <div className="h-16 flex items-center justify-end px-4 border-b border-gray-200">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-6">
                <Avatar className="h-10 w-10 mr-3">
                  {user?.avatar && <div className="bg-cover bg-center h-full w-full" style={{ backgroundImage: `url(${user.avatar})` }} />}
                  <AvatarFallback className="bg-eshows-amber text-white">
                    {getAvatarFallback(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user?.name || "Usuário"}</div>
                  <div className="text-sm text-gray-500">{user?.role || "Membro"}</div>
                </div>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={location.pathname === item.href ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      location.pathname === item.href
                        ? "bg-eshows-orange text-white hover:bg-eshows-orange/90"
                        : "text-gray-700"
                    )}
                    onClick={() => {
                      navigate(item.href);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700"
                  onClick={() => {
                    navigate("/profile");
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="h-5 w-5" />
                  <span className="ml-3">Meu Perfil</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-3">Sair</span>
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-50 md:pt-0 pt-16">
        <div className="flex-1 px-4 py-6 md:px-6 md:py-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
