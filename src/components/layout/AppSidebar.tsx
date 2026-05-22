import { LayoutDashboard, Search, Users, MessageSquare, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import logo from "@/assets/logo.png";

const navItems = [{
  title: "Dashboard",
  url: "/dashboard",
  icon: LayoutDashboard
}, {
  title: "Scanner",
  url: "/scanner",
  icon: Search
}, {
  title: "Leads",
  url: "/leads",
  icon: Users
}, {
  title: "Replies",
  url: "/replies",
  icon: MessageSquare,
  disabled: true
}, {
  title: "Settings",
  url: "/settings",
  icon: Settings
}];

export function AppSidebar() {
  const { profile } = useProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-white/10 bg-primary">
      <SidebarHeader className="p-3 border-b border-white/10">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3 px-2")}>
          <img src={logo} alt="Ai Co-pilot" className="h-8 w-8 flex-shrink-0 rounded-[10px]" />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-white tracking-tight text-sm">Lead Generation</span>
              {profile?.product_name && (
                <span className="text-xs text-white/60 truncate max-w-[140px]">
                  {profile.product_name}
                </span>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild disabled={item.disabled}>
                        {item.disabled ? (
                          <div className="flex items-center gap-3 px-3 py-2.5 text-white/40 cursor-not-allowed rounded-lg">
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            {!isCollapsed && (
                              <>
                                <span className="text-sm">{item.title}</span>
                                <span className="ml-auto text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full font-medium">Soon</span>
                              </>
                            )}
                          </div>
                        ) : (
                          <NavLink 
                            to={item.url} 
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors" 
                            activeClassName="bg-white/20 text-white font-medium"
                          >
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            {!isCollapsed && <span className="text-sm">{item.title}</span>}
                          </NavLink>
                        )}
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="flex items-center gap-2">
                        {item.title}
                        {item.disabled && <span className="text-xs text-white/50">(Soon)</span>}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between gap-2">
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-white truncate">
                {profile?.email || "User"}
              </span>
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut} 
                className="text-white/70 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">Sign out</TooltipContent>
            )}
          </Tooltip>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
