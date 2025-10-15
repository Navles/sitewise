import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Building,
  Monitor,
  Box,
  Settings,
  Bot,
} from "lucide-react";
import { Building as BuildingType } from "../types";

interface SidebarProps {
  building: BuildingType | null;
  isCollapsed: boolean;
  onToggle: () => void;
  selectedMenu: string;
  onMenuSelect: (menu: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  building,
  isCollapsed,
  onToggle,
  selectedMenu,
  onMenuSelect,
}) => {
  const itemBase =
    "w-full flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500";

  const renderMenuButton = (
    key: string,
    {
      icon,
      label,
    }: { icon: React.ReactNode; label: string }
  ) => {
    const isActive = selectedMenu === key;
    return (
      <div className="relative group">
        <button
          type="button"
          onClick={() => onMenuSelect(key)}
          className={[
            itemBase,
            isCollapsed ? "justify-center" : "",
            isActive
              ? "bg-blue-600 text-white"
              : "bg-slate-800 hover:bg-slate-700 text-slate-200",
          ].join(" ")}
          aria-pressed={isActive}
        >
          <span>{icon}</span>
          {!isCollapsed && <span className="font-medium">{label}</span>}
        </button>
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-slate-700">
            {label}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-slate-700 rotate-45"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-80"
      } flex flex-col h-full`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-white">Menu</h2>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4 space-y-2">
        {renderMenuButton("building", {
          icon: <Building className="h-5 w-5 text-blue-400" />,
          label: "Building Configuration",
        })}
        {renderMenuButton("webrviz", {
          icon: <Monitor className="h-5 w-5 text-green-400" />,
          label: "Web RVIZ Configuration",
        })}
        {renderMenuButton("gazebo", {
          icon: <Box className="h-5 w-5 text-purple-400" />,
          label: "Gazebo Configuration",
        })}
        {renderMenuButton("robots", {
          icon: <Bot className="h-5 w-5 text-cyan-400" />,
          label: "Robot Management",
        })}
   
      </div>
    </div>
  );
};
