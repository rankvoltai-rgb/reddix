import { Home, Search, Users, MessageSquare, Settings, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Scanner", url: "/scanner", icon: Search, disabled: true },
  { title: "Leads", url: "/leads", icon: Users, disabled: true },
  { title: "Replies", url: "/replies", icon: MessageSquare, disabled: true },
  { title: "Settings", url: "/settings", icon: Settings, disabled: true },
];

export function AppSidebar() {
  const { profile } = useProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">R</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">Reddix</span>
            {profile?.product_name && (
              <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                {profile.product_name}
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild disabled={item.disabled}>
                    {item.disabled ? (
                      <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground cursor-not-allowed opacity-50">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded">Soon</span>
                      </div>
                    ) : (
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground truncate">
              {profile?.email || "User"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
