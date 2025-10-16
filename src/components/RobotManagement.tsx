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
  ChevronUp,
  Mic,
  MicOff,
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
  const activeTabRef = useRef(activeTab);

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

  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

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

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

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
      const responseContent = generateTabSpecificResponse(
        userMessage.content,
        activeTab
      );

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

  /** ----- Context-aware response generation with ACTIONS ----- */
  const generateTabSpecificResponse = (
    userMessage: string,
    tab: string
  ): string => {
    const lowerMessage = userMessage.toLowerCase();

    switch (tab) {
      case "history":
        if (
          lowerMessage.includes("recent") ||
          lowerMessage.includes("latest")
        ) {
          return `Here are the recent activities:\n\n• CleanBot Alpha completed cleaning on Floor 3 at ${new Date(
            Date.now() - 1800000
          ).toLocaleTimeString()}\n• System initialized with 3 robots at ${new Date(
            Date.now() - 3600000
          ).toLocaleTimeString()}\n\nWould you like details about a specific robot or time period?`;
        }
        if (
          lowerMessage.includes("cleanbot alpha") ||
          lowerMessage.includes("robot-1")
        ) {
          return `CleanBot Alpha History:\n\n• Status: Online\n• Last Activity: Cleaning task completed on Floor 3\n• Battery: 85%\n• Location: Floor 3 - Corridor A\n\nThis robot has been performing well with consistent cleaning schedules.`;
        }
        if (
          lowerMessage.includes("today") ||
          lowerMessage.includes("activities")
        ) {
          return `Today's Robot Activities:\n\n• 09:00 - CleanBot Alpha started daily cleaning routine\n• 10:30 - CleanBot Beta began security patrol\n• 14:15 - CleanBot Gamma entered charging mode\n• 15:45 - CleanBot Alpha completed Floor 3 cleaning\n\nAll robots are operating within normal parameters.`;
        }
        return `I can help you with robot history. Ask me about:\n• "Recent activities"\n• "CleanBot Alpha history"\n• "Today's activities"\n• "Robot performance"`;

      case "schedules":
        return handleScheduleCommand(userMessage);

      case "monitoring":
        return handleMonitoringCommand(userMessage);

      case "reports":
        return handleReportsCommand(userMessage);

      default:
        return `I'm here to help with robot management. What would you like to know about?`;
    }
  };

  /** ----- Schedule Command Handler ----- */
  const handleScheduleCommand = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // CREATE schedule
    if (
      lowerMessage.includes("create") ||
      lowerMessage.includes("add") ||
      lowerMessage.includes("new")
    ) {
      const robotName = extractRobotName(lowerMessage);
      const scheduleType = extractScheduleType(lowerMessage);
      const time = extractTime(lowerMessage);
      const frequency = extractFrequency(lowerMessage);

      const robotId =
        robots.find((r) => r.name.toLowerCase().includes(robotName))?.id ||
        robots[0]?.id;

      const newSchedule: Schedule = {
        id: `schedule-${Date.now()}`,
        name: `${
          scheduleType.charAt(0).toUpperCase() + scheduleType.slice(1)
        } Task`,
        robotId: robotId || "",
        type: scheduleType as any,
        frequency: frequency as any,
        time: time,
        isActive: true,
        nextRun: computeNextRun(frequency as any, time),
      };

      setSchedules((prev) => [newSchedule, ...prev]);
      return `✅ Schedule created successfully!\n\n• Task: ${
        newSchedule.name
      }\n• Robot: ${
        robots.find((r) => r.id === robotId)?.name
      }\n• Time: ${time}\n• Frequency: ${frequency}\n• Status: Active`;
    }

    // DELETE schedule
    if (
      lowerMessage.includes("delete") ||
      lowerMessage.includes("remove") ||
      lowerMessage.includes("cancel")
    ) {
      const scheduleIndex = extractScheduleIndex(lowerMessage);
      if (schedules.length > scheduleIndex) {
        const deletedSchedule = schedules[scheduleIndex];
        setSchedules((prev) => prev.filter((_, idx) => idx !== scheduleIndex));
        return `🗑️ Schedule deleted successfully!\n\n• "${deletedSchedule.name}" has been removed from the schedule list.`;
      }
      return `❌ Could not find that schedule. Say "show schedules" to see all schedules.`;
    }

    // PAUSE/DISABLE schedule
    if (
      lowerMessage.includes("pause") ||
      lowerMessage.includes("disable") ||
      lowerMessage.includes("stop")
    ) {
      const scheduleIndex = extractScheduleIndex(lowerMessage);
      if (schedules.length > scheduleIndex) {
        setSchedules((prev) =>
          prev.map((s, idx) =>
            idx === scheduleIndex ? { ...s, isActive: false } : s
          )
        );
        return `⏸️ Schedule paused successfully!\n\n• The schedule has been disabled and will not run.`;
      }
      return `❌ Could not find that schedule. Say "show schedules" to see all schedules.`;
    }

    // ACTIVATE/ENABLE schedule
    if (
      lowerMessage.includes("activate") ||
      lowerMessage.includes("enable") ||
      lowerMessage.includes("resume")
    ) {
      const scheduleIndex = extractScheduleIndex(lowerMessage);
      if (schedules.length > scheduleIndex) {
        setSchedules((prev) =>
          prev.map((s, idx) =>
            idx === scheduleIndex ? { ...s, isActive: true } : s
          )
        );
        return `▶️ Schedule activated successfully!\n\n• The schedule is now active and will run as planned.`;
      }
      return `❌ Could not find that schedule. Say "show schedules" to see all schedules.`;
    }

    // SHOW/LIST schedules
    if (
      lowerMessage.includes("show") ||
      lowerMessage.includes("list") ||
      lowerMessage.includes("all")
    ) {
      if (schedules.length === 0) {
        return `No schedules found. Say "create cleaning schedule" to add one.`;
      }
      const scheduleList = schedules
        .map(
          (s, idx) =>
            `${idx + 1}. ${s.name} - ${
              robots.find((r) => r.id === s.robotId)?.name
            } at ${s.time} (${s.frequency}) - ${
              s.isActive ? "✅ Active" : "⏸️ Paused"
            }`
        )
        .join("\n");
      return `📋 Current Schedules:\n\n${scheduleList}\n\nSay "delete schedule 1" or "pause schedule 2" to modify.`;
    }

    return `I can help you manage schedules. Try:\n• "Create cleaning schedule at 9 AM daily"\n• "Show all schedules"\n• "Delete schedule 1"\n• "Pause schedule 2"`;
  };

  /** ----- Monitoring Command Handler ----- */
  const handleMonitoringCommand = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("status") || lowerMessage.includes("online")) {
      return `Current Robot Status:\n\n• CleanBot Alpha: Online (85% battery)\n• CleanBot Beta: Busy (92% battery)\n• CleanBot Gamma: Charging (45% battery)\n\nAll robots have strong connection signals.`;
    }
    if (lowerMessage.includes("battery") || lowerMessage.includes("power")) {
      return `Battery Levels:\n\n• CleanBot Alpha: 85% (Good)\n• CleanBot Beta: 92% (Excellent)\n• CleanBot Gamma: 45% (Charging)\n\nCleanBot Gamma is currently charging and will be ready in ~2 hours.`;
    }
    if (lowerMessage.includes("location") || lowerMessage.includes("where")) {
      return `Robot Locations:\n\n• CleanBot Alpha: Floor 3 - Corridor A\n• CleanBot Beta: Floor 1 - Main Entrance\n• CleanBot Gamma: Charging Station B\n\nAll robots are in their expected locations.`;
    }
    return `I can help you monitor robots. Ask me about:\n• "Robot status"\n• "Battery levels"\n• "Robot locations"`;
  };

  /** ----- Reports Command Handler ----- */
  const handleReportsCommand = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("performance") ||
      lowerMessage.includes("stats")
    ) {
      return `System Performance Summary:\n\n• Uptime: 99.8%\n• Task Success Rate: 94.2%\n• Average Response Time: 1.2s\n• Active Robots: 3/3\n\nPerformance is excellent across all metrics.`;
    }
    if (lowerMessage.includes("week") || lowerMessage.includes("weekly")) {
      return `Weekly Report Summary:\n\n• Total Tasks Completed: 156\n• Average Battery Usage: 67%\n• Maintenance Alerts: 2 (resolved)\n• Efficiency Rating: 94.2%\n\nThis week showed improved efficiency compared to last week.`;
    }
    if (lowerMessage.includes("activity") || lowerMessage.includes("usage")) {
      return `Robot Activity Analysis:\n\n• Most Active: CleanBot Alpha (45 hours)\n• Peak Usage Time: 9 AM - 5 PM\n• Maintenance Hours: 12 hours total\n• Idle Time: 8% average\n\nOptimal usage patterns detected.`;
    }
    return `I can help you with reports. Ask me about:\n• "Performance stats"\n• "Weekly reports"\n• "Activity analysis"`;
  };

  /** ----- Helper Functions for Parsing ----- */
  const extractRobotName = (message: string): string => {
    if (message.includes("alpha")) return "alpha";
    if (message.includes("beta")) return "beta";
    if (message.includes("gamma")) return "gamma";
    return "alpha";
  };

  const extractScheduleType = (message: string): string => {
    if (message.includes("clean")) return "cleaning";
    if (message.includes("security") || message.includes("patrol"))
      return "security";
    if (message.includes("maintenance") || message.includes("maintain"))
      return "maintenance";
    return "cleaning";
  };

  const extractTime = (message: string): string => {
    const timeMatch = message.match(/(\d{1,2})\s*(am|pm|AM|PM)/);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const period = timeMatch[2].toLowerCase();
      if (period === "pm" && hour < 12) hour += 12;
      if (period === "am" && hour === 12) hour = 0;
      return `${hour.toString().padStart(2, "0")}:00`;
    }
    const time24Match = message.match(/(\d{1,2}):(\d{2})/);
    if (time24Match) {
      return `${time24Match[1].padStart(2, "0")}:${time24Match[2]}`;
    }
    return "09:00";
  };

  const extractFrequency = (message: string): string => {
    if (message.includes("daily") || message.includes("every day"))
      return "daily";
    if (message.includes("weekly") || message.includes("week")) return "weekly";
    if (message.includes("hourly") || message.includes("hour")) return "hourly";
    return "daily";
  };

  const extractScheduleIndex = (message: string): number => {
    const match = message.match(/schedule\s+(\d+)/);
    if (match) return parseInt(match[1]) - 1;
    const firstMatch = message.match(/first/);
    if (firstMatch) return 0;
    const lastMatch = message.match(/last/);
    if (lastMatch) return schedules.length - 1;
    return 0;
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

  const handleSendVoiceMessage = async (message: string) => {
    if (!message.trim() || isTabChatProcessing) return;

    const userMessage: RobotMessage = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setTabChatMessages((prev) => [...prev, userMessage]);
    setTabChatInput("");
    setIsTabChatProcessing(true);

    setTimeout(() => {
      const responseContent = generateTabSpecificResponse(message, activeTab);

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

  /** ----- Voice Recognition ----- */
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTabChatInput(transcript);
        setIsListening(false);

        setTimeout(() => {
          if (!isTabChatProcessing && transcript.trim()) {
            const userMsg: RobotMessage = {
              id: Date.now().toString(),
              type: "user",
              content: transcript,
              timestamp: new Date(),
            };

            setTabChatMessages((prev) => [...prev, userMsg]);
            setTabChatInput("");
            setIsTabChatProcessing(true);

            setTimeout(() => {
              const responseContent = generateTabSpecificResponse(
                transcript,
                activeTabRef.current
              );

              const robotResponse: RobotMessage = {
                id: (Date.now() + 1).toString(),
                type: "robot",
                content: responseContent,
                timestamp: new Date(),
                robotId:
                  selectedRobot !== "all" ? selectedRobot : robots[0]?.id,
              };

              setTabChatMessages((prev) => [...prev, robotResponse]);
              setIsTabChatProcessing(false);
            }, 1500);
          }
        }, 100);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleVoiceRecognition = () => {
    if (!recognition) {
      alert(
        "Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari."
      );
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
    }
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Robot Schedules
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  <Mic className="inline h-4 w-4 mr-1 text-cyan-500" />
                  Use voice commands to create, edit, or delete schedules
                </p>
              </div>
              <button
                onClick={openNewSchedule}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Schedule</span>
              </button>
            </div>

            {schedules.length === 0 ? (
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-12 text-center">
                <Calendar className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">
                  No Schedules Yet
                </h4>
                <p className="text-slate-400 mb-6">
                  Create your first schedule using the button above or voice
                  commands below
                </p>
                <div className="bg-slate-900/50 rounded-lg p-4 text-left max-w-md mx-auto">
                  <p className="text-slate-300 text-sm mb-2">Try saying:</p>
                  <ul className="text-slate-400 text-sm space-y-1">
                    <li>• "Create cleaning schedule at 9 AM daily"</li>
                    <li>• "Add security patrol at 2 PM weekly"</li>
                    <li>• "New maintenance task at 6 PM daily"</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-medium">
                        {schedule.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditSchedule(schedule)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Robot:</span>
                        <span className="text-white font-medium">
                          {robots.find((r) => r.id === schedule.robotId)?.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Type:</span>
                        <span className="text-white capitalize">
                          {schedule.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">
                          Frequency:
                        </span>
                        <span className="text-white capitalize">
                          {schedule.frequency}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Time:</span>
                        <span className="text-white font-mono">
                          {schedule.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">
                          Next Run:
                        </span>
                        <span className="text-white text-sm">
                          {schedule.nextRun.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                        <span className="text-slate-400 text-sm">Status:</span>
                        <div className="flex items-center space-x-2">
                          {schedule.isActive ? (
                            <Play className="h-4 w-4 text-green-400" />
                          ) : (
                            <Pause className="h-4 w-4 text-red-400" />
                          )}
                          <span
                            className={`font-medium ${
                              schedule.isActive
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {schedule.isActive ? "Active" : "Paused"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "monitoring":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Live System Status
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                <Mic className="inline h-4 w-4 mr-1 text-cyan-500" />
                Ask about robot status, battery levels, or locations
              </p>
            </div>

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
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Charts & Reports
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                <Mic className="inline h-4 w-4 mr-1 text-cyan-500" />
                Request performance stats, weekly reports, or activity analysis
              </p>
            </div>

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
          <div className="space-y-6">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 mb-4">
                <Bot className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Robot History & Information
              </h3>
              <p className="text-slate-400 text-lg mb-6 max-w-2xl mx-auto">
                Use the microphone button below to ask questions about robot
                activities, performance, and history.
              </p>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 max-w-2xl mx-auto text-left">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <Mic className="h-5 w-5 mr-2 text-cyan-500" />
                  Try asking:
                </h4>
                <ul className="text-slate-300 space-y-2">
                  <li>• "Show recent activities"</li>
                  <li>• "What did CleanBot Alpha do today?"</li>
                  <li>• "Show robot performance"</li>
                  <li>• "Tell me about CleanBot Beta's history"</li>
                </ul>
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
      <div className="bg-slate-900 rounded-xl shadow-2xl p-6 mb-4">
        {renderTabContent()}

        {/* Chat Conversation Section */}
        {tabChatMessages.length > 0 && (
          <div className="bg-slate-900 rounded-xl shadow-2xl p-6 mb-20 mt-1">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-cyan-500" />
              Conversation History
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {tabChatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-800 text-slate-200 border border-slate-700"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.type === "user"
                          ? "text-cyan-200"
                          : "text-slate-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
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
                        <div
                          className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm">Processing...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Chat Input Section */}
        <div className="bg-slate-900 rounded-xl shadow-2xl p-4 border border-slate-700 mt-5">
          {isListening && (
            <div className="mb-2 flex items-center justify-center space-x-2 text-red-500 animate-pulse">
              <Mic className="h-4 w-4" />
              <span className="text-sm font-medium">
                Listening... Speak now
              </span>
            </div>
          )}
          <form
            onSubmit={handleSendTabMessage}
            className="flex items-center space-x-3"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={tabChatInput}
                onChange={(e) => setTabChatInput(e.target.value)}
                placeholder={`Ask me about ${activeTab}...`}
                className="w-full bg-slate-800 text-white placeholder-slate-400 border border-slate-600 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                disabled={isTabChatProcessing}
              />
              <button
                type="button"
                onClick={toggleVoiceRecognition}
                disabled={isTabChatProcessing}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${
                  isListening
                    ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                    : "bg-cyan-600 hover:bg-cyan-700 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
            <button
              type="submit"
              disabled={isTabChatProcessing || !tabChatInput.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
