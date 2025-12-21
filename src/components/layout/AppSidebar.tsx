import { LayoutDashboard, Search, Users, MessageSquare, Settings, LogOut } from "lucide-react";
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
import logo from "@/assets/logo.png";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Scanner", url: "/scanner", icon: Search },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Replies", url: "/replies", icon: MessageSquare, disabled: true },
  { title: "Settings", url: "/settings", icon: Settings },
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
    <Sidebar className="border-r border-border/50 bg-card/50">
      <SidebarHeader className="p-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Reddix" className="h-9 w-9" />
          <div className="flex flex-col">
            <span className="font-semibold text-foreground tracking-tight">Ai Co-pilot</span>
            {profile?.product_name && (
              <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                {profile.product_name}
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild disabled={item.disabled}>
                    {item.disabled ? (
                      <div className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground/60 cursor-not-allowed rounded-lg">
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.title}</span>
                        <span className="ml-auto text-[10px] bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full font-medium">Soon</span>
                      </div>
                    ) : (
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.title}</span>
                      </NavLink>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium text-foreground truncate">
              {profile?.email || "User"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
