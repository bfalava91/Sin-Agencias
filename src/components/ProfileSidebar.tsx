
import { Home, Heart, Search, MessageSquare } from "lucide-react";

interface ProfileSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ProfileSidebar = ({ activeSection, onSectionChange }: ProfileSidebarProps) => {
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "favourites", label: "Favourites", icon: Heart },
    { id: "saved-searches", label: "Saved Searches", icon: Search },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm p-4">
      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === item.id
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileSidebar;
