// src/components/RobotManagement.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  MessageSquare,
  Calendar,
  Activity,
  BarChart3,
  Send,
  Plus,
  CreditCard as Edit3,
  Trash2,
  Play,
  Pause,
  Clock,
  Battery,
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  MapPin,
  X,
  Save,
  ChevronDown,
  ChevronUp
} from "lucide-react";

/** ----- Types ----- */
interface RobotMessage {
  id: string;
  type: "user" | "robot" | "system";
  content: string;
  timestamp: Date;
  robotId?: string;
}

interface Schedule {
  id: string;
  name: string;
  robotId: string;
  type: "cleaning" | "maintenance";
  frequency: "daily" | "weekly" | "monthly";
  time: string; // "HH:MM"
  isActive: boolean;
  nextRun: Date;
}

interface ScheduleFormData {
  name: string;
  robotId: string;
  type: "cleaning" | "maintenance";
  frequency: "daily" | "weekly" | "monthly";
  time: string; // "HH:MM"
  isActive: boolean;
}

interface Robot {
  id: string;
  name: string;
  type: "cleaner" | "security" | "maintenance";
  status: "online" | "offline" | "busy" | "charging";
  battery: number;
  location: string;
  lastSeen: Date;
}

/** ----- Helpers ----- */
function computeNextRun(
  frequency: ScheduleFormData["frequency"],
  time: string
): Date {
  const [hh, mm] = time.split(":").map(Number);
  const now = new Date();
  const next = new Date(now);
  next.setHours(hh, mm, 0, 0);
  if (next <= now) {
    if (frequency === "daily") next.setDate(next.getDate() + 1);
    else if (frequency === "weekly") next.setDate(next.getDate() + 7);
    else if (frequency === "monthly") next.setMonth(next.getMonth() + 1);
  }
  return next;
}

/** ----- Component ----- */
export const RobotManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
     "history" | "schedules" | "monitoring" | "reports"
  >("history");
  const [chatMessage, setChatMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<string>("all");
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [tabChatMessages, setTabChatMessages] = useState<RobotMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [tabChatInput, setTabChatInput] = useState("");
  const [isTabChatProcessing, setIsTabChatProcessing] = useState(false);

  const [scheduleForm, setScheduleForm] = useState<ScheduleFormData>({
    name: "",
    robotId: "",
    type: "cleaning",
    frequency: "daily",
    time: "09:00",
    isActive: true,
  });

  // Mock data
  const [robots] = useState<Robot[]>([
    {
      id: "robot-1",
      name: "CleanBot Alpha",
      type: "cleaner",
      status: "online",
      battery: 85,
      location: "Floor 3 - Corridor A",
      lastSeen: new Date(),
    },
    {
      id: "robot-2",
      name: "CleanBot Beta",
      type: "security",
      status: "busy",
      battery: 92,
      location: "Floor 1 - Main Entrance",
      lastSeen: new Date(Date.now() - 300000),
    },
    {
      id: "robot-3",
      name: "CleanBot Gamma",
      type: "maintenance",
      status: "charging",
      battery: 45,
      location: "Charging Station B",
      lastSeen: new Date(Date.now() - 1800000),
    },
  ]);

  const [messages, setMessages] = useState<RobotMessage[]>([
    {
      id: "1",
      type: "system",
      content: "Robot Management System initialized. 3 robots connected.",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      type: "robot",
      content: "CleanBot Alpha: Cleaning task completed on Floor 3.",
      timestamp: new Date(Date.now() - 1800000),
      robotId: "robot-1",
    },
  ]);

  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: "schedule-1",
      name: "Daily Floor Cleaning",
      robotId: "robot-1",
      type: "cleaning",
      frequency: "daily",
      time: "09:00",
      isActive: true,
      nextRun: new Date(Date.now() + 86400000),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, tabChatMessages]);

  /** ----- Messaging ----- */
  const handleSendTabMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tabChatInput.trim() || isTabChatProcessing) return;

    const userMessage: RobotMessage = {
      id: Date.now().toString(),
      type: "user",
      content: tabChatInput,
      timestamp: new Date(),
    };

    setTabChatMessages((prev) => [...prev, userMessage]);
    setTabChatInput("");
    setIsTabChatProcessing(true);

    // Generate context-aware response
    setTimeout(() => {
      const responseContent = generateTabSpecificResponse(userMessage.content, activeTab);
      
      const robotResponse: RobotMessage = {
        id: (Date.now() + 1).toString(),
        type: "robot",
        content: responseContent,
        timestamp: new Date(),
        robotId: selectedRobot !== "all" ? selectedRobot : robots[0]?.id,
      };
      
      setTabChatMessages((prev) => [...prev, robotResponse]);
      setIsTabChatProcessing(false);
    }, 1500);
  };

  /** ----- Context-aware response generation ----- */
  const generateTabSpecificResponse = (userMessage: string, tab: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    switch (tab) {
      case "history":
        if (lowerMessage.includes("recent") || lowerMessage.includes("latest")) {
          return `Here are the recent activities:\n\n• CleanBot Alpha completed cleaning on Floor 3 at ${new Date(Date.now() - 1800000).toLocaleTimeString()}\n• System initialized with 3 robots at ${new Date(Date.now() - 3600000).toLocaleTimeString()}\n\nWould you like details about a specific robot or time period?`;
        }
        if (lowerMessage.includes("cleanbot alpha") || lowerMessage.includes("robot-1")) {
          return `CleanBot Alpha History:\n\n• Status: Online\n• Last Activity: Cleaning task completed on Floor 3\n• Battery: 85%\n• Location: Floor 3 - Corridor A\n\nThis robot has been performing well with consistent cleaning schedules.`;
        }
        if (lowerMessage.includes("today") || lowerMessage.includes("activities")) {
          return `Today's Robot Activities:\n\n• 09:00 - CleanBot Alpha started daily cleaning routine\n• 10:30 - CleanBot Beta began security patrol\n• 14:15 - CleanBot Gamma entered charging mode\n• 15:45 - CleanBot Alpha completed Floor 3 cleaning\n\nAll robots are operating within normal parameters.`;
        }
        return `I can help you with robot history. Ask me about:\n• "Recent activities"\n• "CleanBot Alpha history"\n• "Today's activities"\n• "Robot performance"`;
        
      case "schedules":
        if (lowerMessage.includes("active") || lowerMessage.includes("running")) {
          return `Active Schedules:\n\n• Daily Floor Cleaning (CleanBot Alpha)\n  - Time: 09:00\n  - Next Run: ${new Date(Date.now() + 86400000).toLocaleDateString()}\n  - Status: Active\n\nWould you like to create a new schedule or modify existing ones?`;
        }
        if (lowerMessage.includes("create") || lowerMessage.includes("new")) {
          return `To create a new schedule, you can:\n\n1. Click the "New Schedule" button above\n2. Or tell me: "Create cleaning schedule for CleanBot Beta at 2 PM daily"\n\nWhat type of schedule would you like to create?`;
        }
        if (lowerMessage.includes("next") || lowerMessage.includes("upcoming")) {
          return `Upcoming Scheduled Tasks:\n\n• Tomorrow 09:00 - Daily Floor Cleaning (CleanBot Alpha)\n• Next Week - Weekly maintenance check\n\nAll schedules are running on time. Need to modify any schedules?`;
        }
        return `I can help you manage robot schedules. Ask me about:\n• "Active schedules"\n• "Create new schedule"\n• "Upcoming tasks"\n• "Schedule for specific robot"`;
        
      case "monitoring":
        if (lowerMessage.includes("status") || lowerMessage.includes("online")) {
          return `Current Robot Status:\n\n• CleanBot Alpha: Online (85% battery)\n• CleanBot Beta: Busy (92% battery)\n• CleanBot Gamma: Charging (45% battery)\n\nAll robots have strong connection signals. Any specific robot you'd like to monitor?`;
        }
        if (lowerMessage.includes("battery") || lowerMessage.includes("power")) {
          return `Battery Levels:\n\n• CleanBot Alpha: 85% (Good)\n• CleanBot Beta: 92% (Excellent)\n• CleanBot Gamma: 45% (Charging)\n\nCleanBot Gamma is currently charging and will be ready in ~2 hours.`;
        }
        if (lowerMessage.includes("location") || lowerMessage.includes("where")) {
          return `Robot Locations:\n\n• CleanBot Alpha: Floor 3 - Corridor A\n• CleanBot Beta: Floor 1 - Main Entrance\n• CleanBot Gamma: Charging Station B\n\nAll robots are in their expected locations.`;
        }
        return `I can help you monitor robots. Ask me about:\n• "Robot status"\n• "Battery levels"\n• "Robot locations"\n• "Connection status"`;
        
      case "reports":
        if (lowerMessage.includes("performance") || lowerMessage.includes("stats")) {
          return `System Performance Summary:\n\n• Uptime: 99.8%\n• Task Success Rate: 94.2%\n• Average Response Time: 1.2s\n• Active Robots: 3/3\n\nPerformance is excellent across all metrics. Need detailed analysis?`;
        }
        if (lowerMessage.includes("week") || lowerMessage.includes("weekly")) {
          return `Weekly Report Summary:\n\n• Total Tasks Completed: 156\n• Average Battery Usage: 67%\n• Maintenance Alerts: 2 (resolved)\n• Efficiency Rating: 94.2%\n\nThis week showed improved efficiency compared to last week.`;
        }
        if (lowerMessage.includes("activity") || lowerMessage.includes("usage")) {
          return `Robot Activity Analysis:\n\n• Most Active: CleanBot Alpha (45 hours)\n• Peak Usage Time: 9 AM - 5 PM\n• Maintenance Hours: 12 hours total\n• Idle Time: 8% average\n\nOptimal usage patterns detected.`;
        }
        return `I can help you with reports and analytics. Ask me about:\n• "Performance stats"\n• "Weekly reports"\n• "Activity analysis"\n• "Efficiency metrics"`;
        
      default:
        return `I'm here to help with robot management. What would you like to know about?`;
    }
  };

  /** ----- Schedules UI handlers ----- */
  const openNewSchedule = () => {
    setEditingSchedule(null);
    setScheduleForm({
      name: "",
      robotId: robots[0]?.id ?? "",
      type: "cleaning",
      frequency: "daily",
      time: "09:00",
      isActive: true,
    });
    setShowScheduleModal(true);
  };

  const openEditSchedule = (s: Schedule) => {
    setEditingSchedule(s);
    setScheduleForm({
      name: s.name,
      robotId: s.robotId,
      type: s.type,
      frequency: s.frequency,
      time: s.time,
      isActive: s.isActive,
    });
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = () => {
    // Ensure robotId fallback
    const robotId = scheduleForm.robotId || (robots[0]?.id ?? "");

    const payload: Schedule = {
      id: editingSchedule ? editingSchedule.id : `schedule-${Date.now()}`,
      name: scheduleForm.name,
      robotId,
      type: scheduleForm.type,
      frequency: scheduleForm.frequency,
      time: scheduleForm.time,
      isActive: scheduleForm.isActive,
      nextRun: computeNextRun(scheduleForm.frequency, scheduleForm.time),
    };

    if (editingSchedule) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === editingSchedule.id ? payload : s))
      );
    } else {
      setSchedules((prev) => [payload, ...prev]);
    }

    setEditingSchedule(null);
    setShowScheduleModal(false);
    setScheduleForm({
      name: "",
      robotId: "",
      type: "cleaning",
      frequency: "daily",
      time: "09:00",
      isActive: true,
    });
  };

  const handleDeleteSchedule = (id: string) => {
    if (!window.confirm("Delete schedule?")) return;
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  /** ----- Robot helpers ----- */
  const getStatusColor = (status: Robot["status"]) => {
    switch (status) {
      case "online":
        return "text-green-400";
      case "busy":
        return "text-yellow-400";
      case "charging":
        return "text-blue-400";
      case "offline":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: Robot["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4" />;
      case "busy":
        return <Activity className="h-4 w-4" />;
      case "charging":
        return <Battery className="h-4 w-4" />;
      case "offline":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  /** ----- Render tab contents ----- */
  const renderTabContent = () => {
    switch (activeTab) {
      case "schedules":
        return (
          <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                Robot Schedules
              </h3>
              <button
                onClick={openNewSchedule}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Schedule</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-slate-800 rounded-lg p-6 border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">{schedule.name}</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditSchedule(schedule)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Robot:</span>
                      <span className="text-white">
                        {robots.find((r) => r.id === schedule.robotId)?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Type:</span>
                      <span className="text-white capitalize">
                        {schedule.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Frequency:</span>
                      <span className="text-white capitalize">
                        {schedule.frequency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Time:</span>
                      <span className="text-white">{schedule.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Next Run:</span>
                      <span className="text-white">
                        {schedule.nextRun.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Status:</span>
                      <div className="flex items-center space-x-2">
                        {schedule.isActive ? (
                          <Play className="h-4 w-4 text-green-400" />
                        ) : (
                          <Pause className="h-4 w-4 text-red-400" />
                        )}
                        <span
                          className={
                            schedule.isActive
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {schedule.isActive ? "Active" : "Paused"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "monitoring":
        return (
          <div className="space-y-6 pb-20">
            <h3 className="text-xl font-semibold text-white">
              Live System Status
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {robots.map((robot) => (
                <div
                  key={robot.id}
                  className="bg-slate-800 rounded-lg p-6 border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">{robot.name}</h4>
                    <div
                      className={`flex items-center space-x-1 ${getStatusColor(
                        robot.status
                      )}`}
                    >
                      {getStatusIcon(robot.status)}
                      <span className="text-sm capitalize">{robot.status}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 flex items-center space-x-1">
                          <Battery className="h-4 w-4" />
                          <span>Battery</span>
                        </span>
                        <span className="text-white">{robot.battery}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            robot.battery > 50
                              ? "bg-green-500"
                              : robot.battery > 20
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${robot.battery}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>Location</span>
                      </span>
                      <span className="text-white text-sm">
                        {robot.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Last Seen</span>
                      </span>
                      <span className="text-white text-sm">
                        {robot.lastSeen.toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center space-x-1">
                        <Wifi className="h-4 w-4" />
                        <span>Connection</span>
                      </span>
                      <span className="text-green-400">Strong</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6 pb-20">
            <h3 className="text-xl font-semibold text-white">
              Charts & Reports
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Robot Activity</span>
                </h4>
                <div className="h-48 bg-slate-700 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Activity Chart</p>
                    <p className="text-xs">Last 7 days</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>System Performance</span>
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">Uptime</span>
                      <span className="text-green-400">99.8%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "99.8%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">Task Success Rate</span>
                      <span className="text-blue-400">94.2%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "94.2%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">
                        Average Response Time
                      </span>
                      <span className="text-yellow-400">1.2s</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "history":
        return (
          <div className="space-y-6 pb-20">
            <h3 className="text-xl font-semibold text-white">Robot History</h3>

            <div className="bg-slate-800 rounded-lg border border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-medium">Recent Activities</h4>
                  <select className="bg-slate-700 text-white border border-slate-600 rounded px-3 py-1 text-sm">
                    <option>All Robots</option>
                    {robots.map((robot) => (
                      <option key={robot.id} value={robot.id}>
                        {robot.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {messages
                  .filter((m) => m.type === "robot" || m.type === "system")
                  .map((message) => (
                    <div
                      key={message.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="bg-blue-600 p-2 rounded-full">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{message.content}</p>
                        <p className="text-slate-400 text-xs mt-1">
                          {message.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /** ----- Clear chat when switching tabs ----- */
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab as any);
    setTabChatMessages([]); // Clear chat messages when switching tabs
    setTabChatInput(""); // Clear input
  };

  return (
    <div className="space-y-6 relative pb-24">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Robot Management</h2>
        <p className="text-slate-400">
          Monitor, control, and schedule your robotic fleet operations.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800 rounded-lg p-1 border border-slate-700">
        <div className="flex space-x-1">
          {[
            { key: "history", label: "History", icon: Clock },
            { key: "schedules", label: "Schedules", icon: Calendar },
            { key: "monitoring", label: "Monitoring", icon: Activity },
            { key: "reports", label: "Reports", icon: BarChart3 },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === key
                  ? "bg-cyan-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-slate-900 rounded-xl shadow-2xl p-6">
        {/* Chat Messages Display */}
        {tabChatMessages.length > 0 && (
          <div className="mb-6 space-y-4 max-h-60 overflow-y-auto">
            {tabChatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-md px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.type === 'user'
                        ? 'text-cyan-200'
                        : 'text-slate-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTabChatProcessing && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-200 px-4 py-3 rounded-lg border border-slate-700">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">Processing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
        
        {renderTabContent()}
      </div>

      {/* Fixed Chat Input at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 p-4 z-40">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSendTabMessage} className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={tabChatInput}
                onChange={(e) => setTabChatInput(e.target.value)}
                placeholder={`Ask me about ${activeTab}...`}
                className="w-full bg-slate-800 text-white placeholder-slate-400 border border-slate-600 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                disabled={isTabChatProcessing}
              />
              {/* Dummy Mic Button */}
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                title="Voice input (coming soon)"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <button
              type="submit"
              disabled={!tabChatInput.trim() || isTabChatProcessing}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-full p-3 transition-colors flex items-center justify-center"
              title="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-blue-900 px-6 py-4 rounded-t-xl border-b border-blue-800 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                {editingSchedule ? "Edit Schedule" : "New Schedule"}
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Schedule Name
                </label>
                <input
                  type="text"
                  value={scheduleForm.name}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter schedule name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Robot
                </label>
                <select
                  value={scheduleForm.robotId}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      robotId: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {robots.map((robot) => (
                    <option key={robot.id} value={robot.id}>
                      {robot.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Task Type
                </label>
                <select
                  value={scheduleForm.type}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      type: e.target.value as any,
                    }))
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cleaning">Cleaning</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Frequency
                </label>
                <select
                  value={scheduleForm.frequency}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      frequency: e.target.value as any,
                    }))
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={scheduleForm.isActive}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-slate-300">
                  Schedule is active
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-800 px-6 py-4 rounded-b-xl border-t border-slate-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSchedule}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{editingSchedule ? "Update" : "Create"} Schedule</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RobotManagement;