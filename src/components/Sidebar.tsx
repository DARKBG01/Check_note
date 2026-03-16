import { GraduationCap, LayoutDashboard, Users, BookOpen, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "students", label: "Étudiants", icon: Users },
  { id: "grades", label: "Notes", icon: ClipboardList },
  { id: "subjects", label: "Matières", icon: BookOpen },
];

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg accent-gradient">
          <GraduationCap className="h-6 w-6 text-accent-foreground" />
        </div>
        <div>
          <h1 className="font-display text-lg leading-tight text-sidebar-foreground">EduNotes</h1>
          <p className="text-xs text-sidebar-foreground/60">Gestion des notes</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              activeTab === item.id
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/40">© 2026 EduNotes v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
