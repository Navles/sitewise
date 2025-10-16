import { useState, useCallback } from "react";
import { useEffect } from "react";
import {
  Building,
  Floor,
  Restroom,
  Corridor,
  Lift,
  ChatMessage,
  BuildingCollection,
} from "../types";

const STORAGE_KEYS = {
  BUILDINGS: "sitewise_buildings_data",
  MESSAGES: "sitewise_chat_messages",
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;

    const parsed = JSON.parse(stored);

    // If loading chat messages, convert timestamp strings back to Date objects
    if (key === STORAGE_KEYS.MESSAGES && Array.isArray(parsed)) {
      return parsed.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp),
      })) as T;
    }

    return parsed;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

export const useBuildingManager = () => {
  const [buildingCollection, setBuildingCollection] =
    useState<BuildingCollection>(() =>
      loadFromStorage(STORAGE_KEYS.BUILDINGS, {
        buildings: [],
        activeBuilding: null,
      })
    );
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadFromStorage(STORAGE_KEYS.MESSAGES, [
      {
        id: "1",
        type: "assistant",
        content:
          '🏢 **Welcome to Site Wise Building Assistant!**\n\nI can help you manage your buildings with these commands:\n\n**🏗️ Create Buildings:**\n• "Create Building A with 5 floors"\n• "Create default building"\n• "Create Office Complex with 3 floors, 2 restrooms, 1 corridor per floor"\n\n**➕ Add Components:**\n• "Add 2 floors"\n• "Add 3 restrooms in floor 5"\n• "Add 2 corridors to floor 3"\n• "Add 1 floor and 2 restrooms"\n\n**✏️ Rename Single:**\n• "Rename building to Hospital"\n• "Rename building Office Complex to HQ"\n• "Rename floor 1 to Lobby"\n• "Rename all floors to Level"\n• "Rename restroom 1 in floor 2 to Main Restroom"\n• "Rename all restrooms in building Office Complex to Toilet"\n• "Rename corridor 2 on floor 3 to East Wing"\n\n**✨ Bulk Rename:**\n• "Rename all floors to [Ground, First, Second]"\n• "Rename all restrooms in floor 1 to [Men, Women]"\n• "Rename all corridors in floor 2 to [North Wing, South Wing]"\n\n**🔄 Manage Buildings:**\n• "Switch to Building A"\n• "List all buildings"\n\n**💬 Help & Info:**\n• "Show available commands" - Display all commands\n• "Help" - Get assistance\n• "What can you do" - See capabilities\n\n💡 **Tip:** You can also use the dropdown selector above to switch buildings visually!',
        timestamp: new Date(),
      },
    ])
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Get current active building
  const building =
    buildingCollection.buildings.find(
      (b) => b.id === buildingCollection.activeBuilding
    ) || null;

  // Save buildings data to localStorage whenever it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BUILDINGS, buildingCollection);
  }, [buildingCollection]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MESSAGES, messages);
  }, [messages]);

  const getDefaultMessages = (): ChatMessage[] => [
    {
      id: "1",
      type: "assistant",
      content:
        '🏢 **Welcome to Site Wise Building Assistant!**\n\nI can help you manage your buildings with these commands:\n\n**🏗️ Create Buildings:**\n• "Create Building A with 5 floors"\n• "Create default building"\n• "Create Office Complex with 3 floors, 2 restrooms, 1 corridor per floor"\n\n**➕ Add Components:**\n• "Add 2 floors"\n• "Add 3 restrooms in floor 5"\n• "Add 2 corridors to floor 3"\n• "Add 1 floor and 2 restrooms"\n\n**✏️ Rename Single:**\n• "Rename building to Hospital"\n• "Rename building Office Complex to HQ"\n• "Rename floor 1 to Lobby"\n• "Rename all floors to Level"\n• "Rename restroom 1 in floor 2 to Main Restroom"\n• "Rename all restrooms in building Office Complex to Toilet"\n• "Rename corridor 2 on floor 3 to East Wing"\n\n**✨ Bulk Rename:**\n• "Rename all floors to [Ground, First, Second]"\n• "Rename all restrooms in floor 1 to [Men, Women]"\n• "Rename all corridors in floor 2 to [North Wing, South Wing]"\n\n**🔄 Manage Buildings:**\n• "Switch to Building A"\n• "List all buildings"\n\n**💬 Help & Info:**\n• "Show available commands" - Display all commands\n• "Help" - Get assistance\n• "What can you do" - See capabilities\n\n💡 **Tip:** You can also use the dropdown selector above to switch buildings visually!',
      timestamp: new Date(),
    },
  ];

  const generateBuilding = useCallback(
    (
      totalFloors: number,
      restroomsPerFloor: number,
      corridorsPerFloor: number,
      liftsPerCorridor: number = 2,
      overrides?: { id?: string; name?: string }
    ) => {
      const floors: Floor[] = [];
      const buildingId = overrides?.id || `building-${Date.now()}`;

      for (let floorNum = 1; floorNum <= totalFloors; floorNum++) {
        const restrooms: Restroom[] = [];
        const corridors: Corridor[] = [];

        // Generate restrooms
        for (let i = 1; i <= restroomsPerFloor; i++) {
          restrooms.push({
            id: `${buildingId}-floor-${floorNum}-restroom-${i}`,
            name: `Restroom ${i}`,
            position: { x: 100 + i * 150, y: 50 },
          });
        }

        // Generate corridors with lifts
        for (let i = 1; i <= corridorsPerFloor; i++) {
          const lifts: Lift[] = [];
          for (let j = 1; j <= liftsPerCorridor; j++) {
            lifts.push({
              id: `${buildingId}-floor-${floorNum}-corridor-${i}-lift-${j}`,
              position: { x: 50 + j * 100, y: 200 + i * 100 },
            });
          }

          corridors.push({
            id: `${buildingId}-floor-${floorNum}-corridor-${i}`,
            name: `Corridor ${i}`,
            position: { x: 100, y: 200 + i * 100 },
            lifts,
          });
        }

        floors.push({
          id: `${buildingId}-floor-${floorNum}`,
          number: floorNum,
          restrooms,
          corridors,
        });
      }

      const newBuilding: Building = {
        id: buildingId,
        name: overrides?.name || "My Building",
        totalFloors,
        floors,
      };

      return newBuilding;
    },
    []
  );

  const parseUserMessage = useCallback(
    (
      message: string
    ): {
      buildingName?: string;
      floors: number;
      restrooms: number;
      corridors: number;
      lifts: number;
    } | null => {
      const lowerMessage = message.toLowerCase();

      // Check for default building request
      if (
        lowerMessage.includes("default") ||
        lowerMessage.includes("create default")
      ) {
        return {
          buildingName: "My Building",
          floors: 5,
          restrooms: 2,
          corridors: 2,
          lifts: 2,
        };
      }

      // Extract building name - multiple patterns
      let buildingNameMatch = null;

      // Pattern 1: "create/build building X with" (allow digits and most characters in the name)
      buildingNameMatch = message.match(
        /(?:create|build)\s+(?:building\s+)?["']?([^"']+?)["']?\s+with/i
      );

      // Pattern 2: "add new building named as X with" (allow digits and most characters in the name)
      if (!buildingNameMatch) {
        buildingNameMatch = message.match(
          /add\s+(?:new\s+)?building\s+(?:named\s+(?:as\s+)?)?["']?([^"']+?)["']?\s+with/i
        );
      }

      // Pattern 3: "build/create building called/named X" (simple format) - allow digits
      if (!buildingNameMatch) {
        buildingNameMatch = message.match(
          /(?:build|create)\s+building\s+(?:called|named)\s+["']?([^"']+?)["']?$/i
        );
      }

      // Pattern 4: "create building X" (simplest format)
      if (!buildingNameMatch) {
        buildingNameMatch = message.match(
          /(?:create|build)\s+building\s+["']?([^"']+?)['"]?$/i
        );
      }

      // Pattern 5: "add (new) building (named as) X"
      if (!buildingNameMatch) {
        buildingNameMatch = message.match(
          /add\s+(?:new\s+)?building\s+(?:named\s+(?:as\s+)?)?["']?([^"']+?)["']?$/i
        );
      }

      // Pattern 6: "create/build the new building (and) named as X"
      if (!buildingNameMatch) {
        buildingNameMatch = message.match(
          /(?:create|build)\s+(?:the\s+)?(?:new\s+)?building\s+(?:and\s+)?(?:named\s+(?:as\s+)?)?["']?([^"']+?)["']?$/i
        );
      }

      // Extract numbers using regex patterns
      const floorMatch = lowerMessage.match(
        /(\d+)\s*(?:floors?|stories|levels)/
      );
      const restroomMatch = lowerMessage.match(
        /(\d+)\s*(?:restrooms?|bathrooms?|toilets?)/
      );
      const corridorMatch = lowerMessage.match(
        /(\d+)\s*(?:corridors?|hallways?)/
      );
      const liftMatch = lowerMessage.match(/(\d+)\s*(?:lifts?|elevators?)/);

      // Check if this is a building creation command
      const isCreationCommand =
        lowerMessage.includes("create") ||
        lowerMessage.includes("build") ||
        (lowerMessage.includes("add") && lowerMessage.includes("building"));

      // If we have specifications (floors + restrooms/corridors), create with those specs
      if (isCreationCommand && floorMatch && (restroomMatch || corridorMatch)) {
        return {
          buildingName: buildingNameMatch
            ? buildingNameMatch[1].trim()
            : undefined,
          floors: parseInt(floorMatch[1]),
          restrooms: restroomMatch ? parseInt(restroomMatch[1]) : 2,
          corridors: corridorMatch ? parseInt(corridorMatch[1]) : 1,
          lifts: liftMatch ? parseInt(liftMatch[1]) : 2,
        };
      }

      // If we have a building name but no specs, create with default values
      if (isCreationCommand && buildingNameMatch) {
        return {
          buildingName: buildingNameMatch[1].trim(),
          floors: 3,
          restrooms: 2,
          corridors: 2,
          lifts: 2,
        };
      }

      return null;
    },
    []
  );

  const parseFloorRename = useCallback(
    (message: string): { floorNumber: number; newName: string } | null => {
      const patterns = [
        /(?:rename|change)\s+floor\s+(\d+)\s+to\s+["']?([^"']+)["']?/i,
        /floor\s+(\d+)\s*[:=]\s*["']?([^"']+)["']?/i,
        /call\s+floor\s+(\d+)\s+["']?([^"']+)["']?/i,
      ];

      for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match) {
          return { floorNumber: parseInt(match[1]), newName: match[2].trim() };
        }
      }
      return null;
    },
    []
  );

  const parseRestroomRename = useCallback(
    (
      message: string
    ): {
      floorNumber: number;
      restroomNumber: number;
      newName: string;
    } | null => {
      const patterns = [
        /(?:rename|change)\s+restroom\s+(\d+)\s+(?:in|on|of)\s+floor\s+(\d+)\s+to\s+["']?([^"']+)["']?/i,
        /(?:rename|change)\s+restroom\s+(\d+)\s+to\s+["']?([^"']+)["']?\s+(?:in|on|of)\s+floor\s+(\d+)/i,
      ];

      for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match) {
          if (pattern === patterns[0]) {
            return {
              restroomNumber: parseInt(match[1]),
              floorNumber: parseInt(match[2]),
              newName: match[3].trim(),
            };
          } else {
            return {
              restroomNumber: parseInt(match[1]),
              floorNumber: parseInt(match[3]),
              newName: match[2].trim(),
            };
          }
        }
      }
      return null;
    },
    []
  );

  const parseCorridorRename = useCallback(
    (
      message: string
    ): {
      floorNumber: number;
      corridorNumber: number;
      newName: string;
    } | null => {
      const patterns = [
        /(?:rename|change)\s+corridor\s+(\d+)\s+(?:in|on|of)\s+floor\s+(\d+)\s+to\s+["']?([^"']+)["']?/i,
        /(?:rename|change)\s+corridor\s+(\d+)\s+to\s+["']?([^"']+)["']?\s+(?:in|on|of)\s+floor\s+(\d+)/i,
      ];

      for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match) {
          if (pattern === patterns[0]) {
            return {
              corridorNumber: parseInt(match[1]),
              floorNumber: parseInt(match[2]),
              newName: match[3].trim(),
            };
          } else {
            return {
              corridorNumber: parseInt(match[1]),
              floorNumber: parseInt(match[3]),
              newName: match[2].trim(),
            };
          }
        }
      }
      return null;
    },
    []
  );

  // NEW: Parse bulk rename command
  const parseBulkRename = useCallback(
    (
      message: string
    ): { type: string; changes: any[]; floorNumber?: number } | null => {
      const lowerMessage = message.toLowerCase();

      // Check for bulk rename patterns
      if (
        !lowerMessage.includes("rename all") &&
        !lowerMessage.includes("change all")
      ) {
        return null;
      }

      // Pattern: "rename all floors to [name1, name2, name3]"
      const floorBulkMatch = message.match(
        /(?:rename|change)\s+all\s+floors?\s+to\s+\[([^\]]+)\]/i
      );
      if (floorBulkMatch) {
        const names = floorBulkMatch[1]
          .split(",")
          .map((n) => n.trim().replace(/['"]/g, ""));
        return { type: "floors", changes: names };
      }

      // Pattern: "rename all restrooms in floor X to [name1, name2]"
      const restroomBulkMatch = message.match(
        /(?:rename|change)\s+all\s+restrooms?\s+(?:in|on)\s+floor\s+(\d+)\s+to\s+\[([^\]]+)\]/i
      );
      if (restroomBulkMatch) {
        const floorNum = parseInt(restroomBulkMatch[1]);
        const names = restroomBulkMatch[2]
          .split(",")
          .map((n) => n.trim().replace(/['"]/g, ""));
        return {
          type: "restrooms",
          changes: names,
          floorNumber: floorNum as number,
        };
      }

      // Pattern: "rename all corridors in floor X to [name1, name2]"
      const corridorBulkMatch = message.match(
        /(?:rename|change)\s+all\s+corridors?\s+(?:in|on)\s+floor\s+(\d+)\s+to\s+\[([^\]]+)\]/i
      );
      if (corridorBulkMatch) {
        const floorNum = parseInt(corridorBulkMatch[1]);
        const names = corridorBulkMatch[2]
          .split(",")
          .map((n) => n.trim().replace(/['"]/g, ""));
        return { type: "corridors", changes: names, floorNumber: floorNum };
      }

      return null;
    },
    []
  );

  const parseBuildingNameChange = useCallback(
    (message: string): string | null => {
      const lowerMessage = message.toLowerCase();

      // Check for name change commands
      const namePatterns = [
        /(?:change|rename|update|set)\s+(?:building\s+)?name\s+to\s+["']?([^"']+)["']?/i,
        /(?:building\s+)?name\s*[:=]\s*["']?([^"']+)["']?/i,
        /call\s+(?:the\s+)?building\s+["']?([^"']+)["']?/i,
      ];

      for (const pattern of namePatterns) {
        const match = message.match(pattern);
        if (match) {
          return match[1].trim();
        }
      }

      return null;
    },
    []
  );

  const parseBuildingSwitch = useCallback((message: string): string | null => {
    const patterns = [
      /(?:switch|change|go)\s+to\s+(?:building\s+)?["']?([^"']+)["']?/i,
      /(?:select|use)\s+(?:building\s+)?["']?([^"']+)["']?/i,
      /(?:activate|set)\s+(?:building\s+)?["']?([^"']+)["']?/i,
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return null;
  }, []);

  const parseListBuildings = useCallback((message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return (
      (lowerMessage.includes("list") &&
        (lowerMessage.includes("building") || lowerMessage.includes("all"))) ||
      lowerMessage === "buildings" ||
      lowerMessage.includes("show all buildings")
    );
  }, []);

  // NEW: Parse show commands request
  const parseShowCommands = useCallback((message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return (
      (lowerMessage.includes("show") ||
        lowerMessage.includes("list") ||
        lowerMessage.includes("what")) &&
      (lowerMessage.includes("command") ||
        lowerMessage.includes("help") ||
        lowerMessage.includes("can you do"))
    );
  }, []);

  const parseEditCommand = useCallback(
    (message: string): { type: string; value: any } | null => {
      const lowerMessage = message.toLowerCase();

      // Don't parse if this is a building creation command
      if (
        lowerMessage.includes("add") &&
        lowerMessage.includes("building") &&
        lowerMessage.includes("with")
      ) {
        return null;
      }

      // First check for specific restroom/corridor additions to a floor (most specific patterns)
      const addRestroomToFloorMatch = lowerMessage.match(
        /add\s+(\d+)\s*(?:more\s+)?restrooms?\s+(?:to|in|on)\s+floor\s+(\d+)/
      );
      if (addRestroomToFloorMatch) {
        return {
          type: "add_restrooms",
          value: {
            count: parseInt(addRestroomToFloorMatch[1]),
            floor: parseInt(addRestroomToFloorMatch[2]),
          },
        };
      }

      const addCorridorToFloorMatch = lowerMessage.match(
        /add\s+(\d+)\s*(?:more\s+)?corridors?\s+(?:to|in|on)\s+floor\s+(\d+)/
      );
      if (addCorridorToFloorMatch) {
        return {
          type: "add_corridors",
          value: {
            count: parseInt(addCorridorToFloorMatch[1]),
            floor: parseInt(addCorridorToFloorMatch[2]),
          },
        };
      }

      // Check for adding only restrooms (no floor specified)
      const addRestroomMatch = lowerMessage.match(
        /add\s+(\d+)\s*(?:more\s+)?restrooms?(?!\s+(?:to|in|on)\s+floor)/
      );
      if (addRestroomMatch) {
        return {
          type: "add_restrooms",
          value: {
            count: parseInt(addRestroomMatch[1]),
            floor: null,
          },
        };
      }

      // Check for adding only corridors (no floor specified)
      const addCorridorMatch = lowerMessage.match(
        /add\s+(\d+)\s*(?:more\s+)?corridors?(?!\s+(?:to|in|on)\s+floor)/
      );
      if (addCorridorMatch) {
        return {
          type: "add_corridors",
          value: {
            count: parseInt(addCorridorMatch[1]),
            floor: null,
          },
        };
      }

      // Check for adding floors only (no restrooms/corridors in the same command)
      const addFloorsOnlyMatch = lowerMessage.match(
        /add\s+(\d+)\s*(?:more\s+)?floors?(?!\s+and)(?!\s*,)/
      );
      if (
        addFloorsOnlyMatch &&
        !lowerMessage.includes("restroom") &&
        !lowerMessage.includes("corridor")
      ) {
        return { type: "add_floors", value: parseInt(addFloorsOnlyMatch[1]) };
      }

      // Enhanced parsing for multiple additions in one command (e.g., "add 2 floors and 3 restrooms")
      if (
        lowerMessage.includes("add") &&
        (lowerMessage.includes("corridor") ||
          lowerMessage.includes("restroom") ||
          lowerMessage.includes("floor"))
      ) {
        const result: any = {};

        // Parse floors - only if explicitly mentioned with a number before "floor(s)"
        const floorMatch = lowerMessage.match(
          /add\s+.*?(\d+)\s*(?:more\s+)?floors?/
        );
        if (floorMatch) {
          result.floors = parseInt(floorMatch[1]);
        }

        // Parse restrooms - only if explicitly mentioned with a number
        const restroomMatch = lowerMessage.match(
          /(\d+)\s*(?:more\s+)?restrooms?/
        );
        if (
          restroomMatch &&
          !lowerMessage.match(/(?:to|in|on)\s+floor\s+\d+/)
        ) {
          result.restrooms = parseInt(restroomMatch[1]);
        }

        // Parse corridors - only if explicitly mentioned with a number
        const corridorMatch = lowerMessage.match(
          /(\d+)\s*(?:more\s+)?corridors?/
        );
        if (
          corridorMatch &&
          !lowerMessage.match(/(?:to|in|on)\s+floor\s+\d+/)
        ) {
          result.corridors = parseInt(corridorMatch[1]);
        }

        // If we detected multiple things, return add_multiple
        if (Object.keys(result).length > 1) {
          return { type: "add_multiple", value: result };
        }
      }

      // Check for remove floors
      if (lowerMessage.includes("remove") && lowerMessage.includes("floor")) {
        const match = lowerMessage.match(/remove\s+(\d+)\s*floors?/);
        if (match) {
          return { type: "remove_floors", value: parseInt(match[1]) };
        }
        return { type: "remove_floors", value: 1 };
      }

      return null;
    },
    []
  );

  const updateBuildingInCollection = useCallback(
    (updatedBuilding: Building) => {
      setBuildingCollection((prev) => ({
        ...prev,
        buildings: prev.buildings.map((b) =>
          b.id === updatedBuilding.id ? updatedBuilding : b
        ),
      }));
    },
    []
  );

  const addBuildingToCollection = useCallback(
    (newBuilding: Building, options?: { setActive?: boolean }) => {
      setBuildingCollection((prev) => ({
        buildings: [...prev.buildings, newBuilding],
        activeBuilding:
          options?.setActive === false ? prev.activeBuilding : newBuilding.id,
      }));
    },
    []
  );

  const findBuildingByName = useCallback(
    (name: string): Building | null => {
      return (
        buildingCollection.buildings.find(
          (b) => b.name.toLowerCase() === name.toLowerCase()
        ) || null
      );
    },
    [buildingCollection.buildings]
  );

  const switchToBuilding = useCallback((buildingId: string) => {
    setBuildingCollection((prev) => ({
      ...prev,
      activeBuilding: buildingId,
    }));
  }, []);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      // Add user message
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: userMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsProcessing(true);

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check for show commands request
      if (parseShowCommands(userMessage)) {
        const assistantResponse = `📋 **Available Commands Reference**\n\n**🏗️ CREATE BUILDINGS:**\n• "Create Building A with 5 floors"\n• "Create default building" (creates 5 floors)\n• "Create Hospital with 3 floors, 2 restrooms, 1 corridor"\n• "Build Office Complex with 8 floors"\n\n**➕ ADD COMPONENTS:**\n• "Add 2 floors"\n• "Add 3 restrooms in floor 5"\n• "Add 2 corridors to floor 3"\n• "Add 1 floor and 2 restrooms" (multiple at once)\n• "Add restrooms" (adds to all floors)\n\n**✏️ RENAME SINGLE ITEM:**\n• "Rename building to Hospital"\n• "Change building name to Medical Center"\n• "Rename floor 1 to Lobby"\n• "Rename restroom 1 in floor 2 to Main Restroom"\n• "Change corridor 2 on floor 3 to East Wing"\n\n**✨ BULK RENAME (NEW!):**\n• "Rename all floors to [Ground, First, Second, Third]"\n• "Rename all restrooms in floor 1 to [Men, Women, Disabled]"\n• "Rename all corridors in floor 2 to [North Wing, South Wing]"\n\n**🔄 MANAGE BUILDINGS:**\n• "List all buildings" - See all your buildings\n• "Switch to Building Name" - Change active building\n• "Use Hospital" - Alternative switch command\n\n**🗑️ REMOVE COMPONENTS:**\n• "Remove 2 floors"\n• "Delete floor"\n\n**💡 TIPS:**\n• Use [brackets] for bulk renaming with comma-separated names\n• The dropdown selector lets you switch buildings visually\n• All changes are automatically saved\n• You can have unlimited buildings!\n\n**Current Status:**\n• Buildings: ${
          buildingCollection.buildings.length
        }\n• Active: ${building ? building.name : "None"}`;

        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: assistantResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsProcessing(false);
        return;
      }

      // Check for list buildings command
      if (parseListBuildings(userMessage)) {
        let assistantResponse = "";
        if (buildingCollection.buildings.length === 0) {
          assistantResponse =
            'No buildings have been created yet. You can create one by saying "Create default building" or "Create Building A with 5 floors".';
        } else {
          assistantResponse = `**Available Buildings:**\n\n${buildingCollection.buildings
            .map(
              (b, index) =>
                `${index + 1}. **${b.name}** (${b.totalFloors} floors)${
                  b.id === buildingCollection.activeBuilding
                    ? " ← *Active*"
                    : ""
                }`
            )
            .join(
              "\n"
            )}\n\n**Commands:**\n• "Switch to Building Name"\n• "Create New Building with X floors"\n• "Rename current building to New Name"`;
        }

        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: assistantResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsProcessing(false);
        return;
      }

      // Check for building switch command
      const switchBuildingName = parseBuildingSwitch(userMessage);
      if (switchBuildingName) {
        const targetBuilding = findBuildingByName(switchBuildingName);
        if (targetBuilding) {
          switchToBuilding(targetBuilding.id);
          const assistantResponse = `✅ Switched to "${targetBuilding.name}" (${targetBuilding.totalFloors} floors). You can now edit this building or upload maps to its components.`;
          const assistantMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: assistantResponse,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        } else {
          const availableBuildings =
            buildingCollection.buildings.length > 0
              ? buildingCollection.buildings
                  .map((b) => `"${b.name}"`)
                  .join(", ")
              : "None";
          const assistantResponse = `❌ Building "${switchBuildingName}" not found.\n\n**Available buildings:** ${availableBuildings}\n\nTip: Use "List all buildings" to see all available buildings.`;
          const assistantMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: assistantResponse,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }
        setIsProcessing(false);
        return;
      }

      // Check for bulk rename command
      const bulkRename = parseBulkRename(userMessage);
      if (bulkRename && building) {
        let assistantResponse = "";
        let updatedBuilding = { ...building };
        let successCount = 0;

        switch (bulkRename.type) {
          case "floors": {
            const { changes } = bulkRename;
            updatedBuilding.floors = updatedBuilding.floors.map(
              (floor, index) => {
                if (index < changes.length && changes[index]) {
                  successCount++;
                  return { ...floor, name: changes[index] };
                }
                return floor;
              }
            );
            updateBuildingInCollection(updatedBuilding);
            assistantResponse = `✅ Successfully renamed ${successCount} floor${
              successCount !== 1 ? "s" : ""
            }!\n\n${updatedBuilding.floors
              .map((f) => `Floor ${f.number}: ${f.name || "Floor " + f.number}`)
              .join("\n")}`;
            break;
          }

          case "restrooms": {
            const { changes, floorNumber } = bulkRename as {
              type: string;
              changes: any[];
              floorNumber: number;
            };
            const targetFloor = updatedBuilding.floors.find(
              (f) => f.number === floorNumber
            );
            if (targetFloor) {
              targetFloor.restrooms = targetFloor.restrooms.map(
                (restroom, index) => {
                  if (index < changes.length && changes[index]) {
                    successCount++;
                    return { ...restroom, name: changes[index] };
                  }
                  return restroom;
                }
              );
              updateBuildingInCollection(updatedBuilding);
              assistantResponse = `✅ Successfully renamed ${successCount} restroom${
                successCount !== 1 ? "s" : ""
              } on Floor ${floorNumber}!\n\n${targetFloor.restrooms
                .map((r, i) => `${i + 1}. ${r.name}`)
                .join("\n")}`;
            } else {
              assistantResponse = `❌ Floor ${floorNumber} doesn't exist in ${building.name}.`;
            }
            break;
          }

          case "corridors": {
            const { changes, floorNumber } = bulkRename;
            const targetFloor = updatedBuilding.floors.find(
              (f) => f.number === floorNumber
            );
            if (targetFloor) {
              targetFloor.corridors = targetFloor.corridors.map(
                (corridor, index) => {
                  if (index < changes.length && changes[index]) {
                    successCount++;
                    return { ...corridor, name: changes[index] };
                  }
                  return corridor;
                }
              );
              updateBuildingInCollection(updatedBuilding);
              assistantResponse = `✅ Successfully renamed ${successCount} corridor${
                successCount !== 1 ? "s" : ""
              } on Floor ${floorNumber}!\n\n${targetFloor.corridors
                .map((c, i) => `${i + 1}. ${c.name}`)
                .join("\n")}`;
            } else {
              assistantResponse = `❌ Floor ${floorNumber} doesn't exist in ${building.name}.`;
            }
            break;
          }
        }

        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: assistantResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsProcessing(false);
        return;
      }

      // Check for restroom rename command (must come before building creation check)
      const restroomRename = parseRestroomRename(userMessage);
      if (restroomRename && building) {
        const targetFloor = building.floors.find(
          (f) => f.number === restroomRename.floorNumber
        );
        if (targetFloor) {
          const targetRestroom =
            targetFloor.restrooms[restroomRename.restroomNumber - 1];
          if (targetRestroom) {
            const updatedBuilding = {
              ...building,
              floors: building.floors.map((floor) => {
                if (floor.id === targetFloor.id) {
                  return {
                    ...floor,
                    restrooms: floor.restrooms.map((restroom, index) =>
                      index === restroomRename.restroomNumber - 1
                        ? { ...restroom, name: restroomRename.newName }
                        : restroom
                    ),
                  };
                }
                return floor;
              }),
            };
            updateBuildingInCollection(updatedBuilding);

            const assistantResponse = `✅ Perfect! Restroom ${restroomRename.restroomNumber} on Floor ${restroomRename.floorNumber} has been renamed to "${restroomRename.newName}".`;
            const assistantMsg: ChatMessage = {
              id: (Date.now() + 1).toString(),
              type: "assistant",
              content: assistantResponse,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
          } else {
            const assistantResponse = `❌ Restroom ${restroomRename.restroomNumber} doesn't exist on Floor ${restroomRename.floorNumber}. Available restrooms: 1-${targetFloor.restrooms.length}`;
            const assistantMsg: ChatMessage = {
              id: (Date.now() + 1).toString(),
              type: "assistant",
              content: assistantResponse,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
          }
        } else {
          const assistantResponse = `❌ Floor ${
            restroomRename.floorNumber
          } doesn't exist in ${
            building.name
          }. Available floors: ${building.floors
            .map((f) => f.number)
            .join(", ")}`;
          const assistantMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: assistantResponse,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }
        setIsProcessing(false);
        return;
      }

      // Check for corridor rename command
      const corridorRename = parseCorridorRename(userMessage);
      if (corridorRename && building) {
        const targetFloor = building.floors.find(
          (f) => f.number === corridorRename.floorNumber
        );
        if (targetFloor) {
          const targetCorridor =
            targetFloor.corridors[corridorRename.corridorNumber - 1];
          if (targetCorridor) {
            const updatedBuilding = {
              ...building,
              floors: building.floors.map((floor) => {
                if (floor.id === targetFloor.id) {
                  return {
                    ...floor,
                    corridors: floor.corridors.map((corridor, index) =>
                      index === corridorRename.corridorNumber - 1
                        ? { ...corridor, name: corridorRename.newName }
                        : corridor
                    ),
                  };
                }
                return floor;
              }),
            };
            updateBuildingInCollection(updatedBuilding);

            const assistantResponse = `✅ Perfect! Corridor ${corridorRename.corridorNumber} on Floor ${corridorRename.floorNumber} has been renamed to "${corridorRename.newName}".`;
            const assistantMsg: ChatMessage = {
              id: (Date.now() + 1).toString(),
              type: "assistant",
              content: assistantResponse,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
          } else {
            const assistantResponse = `❌ Corridor ${corridorRename.corridorNumber} doesn't exist on Floor ${corridorRename.floorNumber}. Available corridors: 1-${targetFloor.corridors.length}`;
            const assistantMsg: ChatMessage = {
              id: (Date.now() + 1).toString(),
              type: "assistant",
              content: assistantResponse,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
          }
        } else {
          const assistantResponse = `❌ Floor ${
            corridorRename.floorNumber
          } doesn't exist in ${
            building.name
          }. Available floors: ${building.floors
            .map((f) => f.number)
            .join(", ")}`;
          const assistantMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: assistantResponse,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }
        setIsProcessing(false);
        return;
      }

      // Check for floor rename command
      const floorRename = parseFloorRename(userMessage);
      if (floorRename && building) {
        const targetFloor = building.floors.find(
          (f) => f.number === floorRename.floorNumber
        );
        if (targetFloor) {
          const updatedBuilding = {
            ...building,
            floors: building.floors.map((floor) =>
              floor.id === targetFloor.id
                ? { ...floor, name: floorRename.newName }
                : floor
            ),
          };
          updateBuildingInCollection(updatedBuilding);

          const assistantResponse = `✅ Perfect! Floor ${floorRename.floorNumber} has been renamed to "${floorRename.newName}".`;
          const assistantMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: assistantResponse,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        } else {
          const assistantResponse = `❌ Floor ${
            floorRename.floorNumber
          } doesn't exist in ${
            building.name
          }. Available floors: ${building.floors
            .map((f) => f.number)
            .join(", ")}`;
          const assistantMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: assistantResponse,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }
        setIsProcessing(false);
        return;
      }

      // Check for building name change (must come before building creation)
      const newName = parseBuildingNameChange(userMessage);
      if (newName && building) {
        const updatedBuilding = { ...building, name: newName };
        updateBuildingInCollection(updatedBuilding);

        const assistantResponse = `✅ Perfect! I've renamed your building to "${newName}".`;
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: assistantResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsProcessing(false);
        return;
      }

      // Parse the message for building creation
      const parsedData = parseUserMessage(userMessage);

      if (parsedData) {
        const buildingName = parsedData.buildingName || "My Building";

        // Check if a building with this name already exists
        const existingBuilding = findBuildingByName(buildingName);
        if (existingBuilding) {
          const assistantResponse = `⚠️ A building named "${buildingName}" already exists!\n\n**Options:**\n• Switch to it: "Switch to ${buildingName}"\n• Create with a different name: "Create ${buildingName} 2 with ${parsedData.floors} floors"\n• List all buildings: "List all buildings"`;
          const assistantMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: assistantResponse,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setIsProcessing(false);
          return;
        }

        // Create a new building (always adds to collection, never replaces)
        const newBuilding = generateBuilding(
          parsedData.floors,
          parsedData.restrooms,
          parsedData.corridors,
          parsedData.lifts,
          { id: `building-${Date.now()}`, name: buildingName }
        );

        // Add to collection and make it active
        addBuildingToCollection(newBuilding, { setActive: true });

        const totalBuildings = buildingCollection.buildings.length + 1;
        const assistantResponse =
          `✅ Perfect! I've created "${buildingName}" with:\n\n` +
          `• ${parsedData.floors} floors\n` +
          `• ${parsedData.restrooms} restrooms per floor\n` +
          `• ${parsedData.corridors} corridors per floor\n` +
          `• ${parsedData.lifts} lifts per corridor\n\n` +
          `📊 **Total buildings in collection:** ${totalBuildings}\n` +
          `🏗️ **Active building:** ${buildingName}\n\n` +
          `You can now:\n` +
          `• Click components to upload 2D maps\n` +
          `• "List all buildings" to see all buildings\n` +
          `• "Switch to [building name]" to work on another building\n` +
          `• "Add floors/restrooms/corridors" to modify this building`;

        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: assistantResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsProcessing(false);
        return;
      }

      // Check for edit commands (only if building exists and not a creation command)
      const editCommand = parseEditCommand(userMessage);
      if (editCommand) {
        if (!building) {
          const assistantResponse = `❌ No building is currently active. Please create a building first or switch to an existing one.\n\n**Commands:**\n• "Create default building"\n• "List all buildings"`;
          const assistantMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: assistantResponse,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setIsProcessing(false);
          return;
        }

        let assistantResponse = "";
        let updatedBuilding = { ...building, floors: [...building.floors] };

        switch (editCommand.type) {
          case "add_multiple": {
            const {
              floors: floorsToAdd,
              restrooms: restroomsToAdd,
              corridors: corridorsToAdd,
              targetFloor,
            } = editCommand.value;
            const changes: string[] = [];

            // Add floors if specified
            if (floorsToAdd) {
              const currentMaxFloor =
                updatedBuilding.floors.length > 0
                  ? Math.max(...updatedBuilding.floors.map((f) => f.number))
                  : 0;
              const newFloors: Floor[] = [];

              for (let i = 1; i <= floorsToAdd; i++) {
                const newFloorNumber = currentMaxFloor + i;
                const timestamp = Date.now() + i;
                const newFloor: Floor = {
                  id: `floor-${newFloorNumber}-${timestamp}`,
                  number: newFloorNumber,
                  restrooms: Array.from({ length: 2 }, (_, j) => ({
                    id: `floor-${newFloorNumber}-restroom-${
                      j + 1
                    }-${timestamp}`,
                    name: `Restroom ${j + 1}`,
                    position: { x: 100 + j * 150, y: 50 },
                  })),
                  corridors: Array.from({ length: 2 }, (_, j) => ({
                    id: `floor-${newFloorNumber}-corridor-${
                      j + 1
                    }-${timestamp}`,
                    name: `Corridor ${j + 1}`,
                    position: { x: 100, y: 200 + j * 100 },
                    lifts: Array.from({ length: 2 }, (_, k) => ({
                      id: `floor-${newFloorNumber}-corridor-${j + 1}-lift-${
                        k + 1
                      }-${timestamp}`,
                      position: { x: 50 + k * 100, y: 200 + j * 100 },
                    })),
                  })),
                };
                newFloors.push(newFloor);
              }
              updatedBuilding.floors = [
                ...updatedBuilding.floors,
                ...newFloors,
              ];
              updatedBuilding.totalFloors = updatedBuilding.floors.length;
              changes.push(`${floorsToAdd} floor${floorsToAdd > 1 ? "s" : ""}`);
            }

            // Add restrooms
            if (restroomsToAdd) {
              if (targetFloor) {
                const floorToUpdate = updatedBuilding.floors.find(
                  (f) => f.number === targetFloor
                );
                if (floorToUpdate) {
                  for (let i = 0; i < restroomsToAdd; i++) {
                    const timestamp = Date.now() + i;
                    floorToUpdate.restrooms.push({
                      id: `${floorToUpdate.id}-restroom-${timestamp}`,
                      name: `Restroom ${
                        floorToUpdate.restrooms.length + i + 1
                      }`,
                      position: {
                        x: 100 + (floorToUpdate.restrooms.length + i) * 150,
                        y: 50,
                      },
                    });
                  }
                  changes.push(
                    `${restroomsToAdd} restroom${
                      restroomsToAdd > 1 ? "s" : ""
                    } to Floor ${targetFloor}`
                  );
                }
              } else {
                updatedBuilding.floors.forEach((floor) => {
                  for (let i = 0; i < restroomsToAdd; i++) {
                    const timestamp = Date.now() + i;
                    floor.restrooms.push({
                      id: `${floor.id}-restroom-${timestamp}`,
                      name: `Restroom ${floor.restrooms.length + i + 1}`,
                      position: {
                        x: 100 + (floor.restrooms.length + i) * 150,
                        y: 50,
                      },
                    });
                  }
                });
                changes.push(
                  `${restroomsToAdd} restroom${
                    restroomsToAdd > 1 ? "s" : ""
                  } to each floor`
                );
              }
            }

            // Add corridors
            if (corridorsToAdd) {
              if (targetFloor) {
                const floorToUpdate = updatedBuilding.floors.find(
                  (f) => f.number === targetFloor
                );
                if (floorToUpdate) {
                  for (let i = 0; i < corridorsToAdd; i++) {
                    const timestamp = Date.now() + i;
                    floorToUpdate.corridors.push({
                      id: `${floorToUpdate.id}-corridor-${timestamp}`,
                      name: `Corridor ${
                        floorToUpdate.corridors.length + i + 1
                      }`,
                      position: {
                        x: 100,
                        y: 200 + (floorToUpdate.corridors.length + i) * 100,
                      },
                      lifts: Array.from({ length: 2 }, (_, k) => ({
                        id: `${floorToUpdate.id}-corridor-${timestamp}-lift-${
                          k + 1
                        }`,
                        position: {
                          x: 50 + k * 100,
                          y: 200 + (floorToUpdate.corridors.length + i) * 100,
                        },
                      })),
                    });
                  }
                  changes.push(
                    `${corridorsToAdd} corridor${
                      corridorsToAdd > 1 ? "s" : ""
                    } to Floor ${targetFloor}`
                  );
                }
              } else {
                updatedBuilding.floors.forEach((floor) => {
                  for (let i = 0; i < corridorsToAdd; i++) {
                    const timestamp = Date.now() + i;
                    floor.corridors.push({
                      id: `${floor.id}-corridor-${timestamp}`,
                      name: `Corridor ${floor.corridors.length + i + 1}`,
                      position: {
                        x: 100,
                        y: 200 + (floor.corridors.length + i) * 100,
                      },
                      lifts: Array.from({ length: 2 }, (_, k) => ({
                        id: `${floor.id}-corridor-${timestamp}-lift-${k + 1}`,
                        position: {
                          x: 50 + k * 100,
                          y: 200 + (floor.corridors.length + i) * 100,
                        },
                      })),
                    });
                  }
                });
                changes.push(
                  `${corridorsToAdd} corridor${
                    corridorsToAdd > 1 ? "s" : ""
                  } to each floor`
                );
              }
            }

            updateBuildingInCollection(updatedBuilding);
            assistantResponse = `✅ Great! I've added ${changes.join(
              ", "
            )} to "${building.name}". You now have ${
              updatedBuilding.totalFloors
            } floors total.`;
            break;
          }

          case "add_floors":
            const floorsToAdd = editCommand.value;
            const currentMaxFloor =
              updatedBuilding.floors.length > 0
                ? Math.max(...updatedBuilding.floors.map((f) => f.number))
                : 0;

            const newFloors: Floor[] = [];
            for (let i = 1; i <= floorsToAdd; i++) {
              const newFloorNumber = currentMaxFloor + i;
              const timestamp = Date.now() + i;
              const newFloor: Floor = {
                id: `floor-${newFloorNumber}-${timestamp}`,
                number: newFloorNumber,
                restrooms: Array.from({ length: 2 }, (_, j) => ({
                  id: `floor-${newFloorNumber}-restroom-${j + 1}-${timestamp}`,
                  name: `Restroom ${j + 1}`,
                  position: { x: 100 + j * 150, y: 50 },
                })),
                corridors: Array.from({ length: 2 }, (_, j) => ({
                  id: `floor-${newFloorNumber}-corridor-${j + 1}-${timestamp}`,
                  name: `Corridor ${j + 1}`,
                  position: { x: 100, y: 200 + j * 100 },
                  lifts: Array.from({ length: 2 }, (_, k) => ({
                    id: `floor-${newFloorNumber}-corridor-${j + 1}-lift-${
                      k + 1
                    }-${timestamp}`,
                    position: { x: 50 + k * 100, y: 200 + j * 100 },
                  })),
                })),
              };
              newFloors.push(newFloor);
            }

            updatedBuilding.floors = [...updatedBuilding.floors, ...newFloors];
            updatedBuilding.totalFloors = updatedBuilding.floors.length;
            updateBuildingInCollection(updatedBuilding);
            assistantResponse = `✅ Great! I've added ${floorsToAdd} floor${
              floorsToAdd > 1 ? "s" : ""
            } to "${building.name}". You now have ${
              updatedBuilding.totalFloors
            } floors total.`;
            break;

          case "remove_floors":
            const floorsToRemove = Math.min(
              editCommand.value,
              building.floors.length - 1
            );
            if (floorsToRemove > 0) {
              const sortedFloors = [...building.floors].sort(
                (a, b) => b.number - a.number
              );
              updatedBuilding.floors = sortedFloors.slice(floorsToRemove);
              updatedBuilding.totalFloors = updatedBuilding.floors.length;
              updateBuildingInCollection(updatedBuilding);
              assistantResponse = `✅ I've removed ${floorsToRemove} floor${
                floorsToRemove > 1 ? "s" : ""
              } from your building. You now have ${
                updatedBuilding.totalFloors
              } floors total.`;
            } else {
              assistantResponse = `❌ I can't remove floors as you need at least one floor in your building.`;
            }
            break;

          case "add_restrooms":
            const { count: restroomCount, floor: targetFloor } =
              editCommand.value;
            if (targetFloor) {
              const floorToUpdate = updatedBuilding.floors.find(
                (f) => f.number === targetFloor
              );
              if (floorToUpdate) {
                for (let i = 0; i < restroomCount; i++) {
                  const newRestroom: Restroom = {
                    id: `${floorToUpdate.id}-restroom-${Date.now()}-${i}`,
                    name: `Restroom ${floorToUpdate.restrooms.length + i + 1}`,
                    position: {
                      x: 100 + (floorToUpdate.restrooms.length + i) * 150,
                      y: 50,
                    },
                  };
                  floorToUpdate.restrooms.push(newRestroom);
                }
                updateBuildingInCollection(updatedBuilding);
                assistantResponse = `✅ Added ${restroomCount} restroom${
                  restroomCount > 1 ? "s" : ""
                } to Floor ${targetFloor}.`;
              } else {
                assistantResponse = `❌ Floor ${targetFloor} doesn't exist. Please specify a valid floor number.`;
              }
            } else {
              updatedBuilding.floors.forEach((floor) => {
                for (let i = 0; i < restroomCount; i++) {
                  const newRestroom: Restroom = {
                    id: `${floor.id}-restroom-${Date.now()}-${i}`,
                    name: `Restroom ${floor.restrooms.length + i + 1}`,
                    position: {
                      x: 100 + (floor.restrooms.length + i) * 150,
                      y: 50,
                    },
                  };
                  floor.restrooms.push(newRestroom);
                }
              });
              updateBuildingInCollection(updatedBuilding);
              assistantResponse = `✅ Added ${restroomCount} restroom${
                restroomCount > 1 ? "s" : ""
              } to each floor.`;
            }
            break;

          case "add_corridors":
            const { count: corridorCount, floor: targetCorridorFloor } =
              editCommand.value;
            if (targetCorridorFloor) {
              const floorToUpdate = updatedBuilding.floors.find(
                (f) => f.number === targetCorridorFloor
              );
              if (floorToUpdate) {
                for (let i = 0; i < corridorCount; i++) {
                  const newCorridor: Corridor = {
                    id: `${floorToUpdate.id}-corridor-${Date.now()}-${i}`,
                    name: `Corridor ${floorToUpdate.corridors.length + i + 1}`,
                    position: {
                      x: 100,
                      y: 200 + (floorToUpdate.corridors.length + i) * 100,
                    },
                    lifts: Array.from({ length: 2 }, (_, k) => ({
                      id: `${
                        floorToUpdate.id
                      }-corridor-${Date.now()}-${i}-lift-${k + 1}`,
                      position: {
                        x: 50 + k * 100,
                        y: 200 + (floorToUpdate.corridors.length + i) * 100,
                      },
                    })),
                  };
                  floorToUpdate.corridors.push(newCorridor);
                }
                updateBuildingInCollection(updatedBuilding);
                assistantResponse = `✅ Added ${corridorCount} corridor${
                  corridorCount > 1 ? "s" : ""
                } to Floor ${targetCorridorFloor}.`;
              } else {
                assistantResponse = `❌ Floor ${targetCorridorFloor} doesn't exist. Please specify a valid floor number.`;
              }
            } else {
              updatedBuilding.floors.forEach((floor) => {
                for (let i = 0; i < corridorCount; i++) {
                  const newCorridor: Corridor = {
                    id: `${floor.id}-corridor-${Date.now()}-${i}`,
                    name: `Corridor ${floor.corridors.length + i + 1}`,
                    position: {
                      x: 100,
                      y: 200 + (floor.corridors.length + i) * 100,
                    },
                    lifts: Array.from({ length: 2 }, (_, k) => ({
                      id: `${floor.id}-corridor-${Date.now()}-${i}-lift-${
                        k + 1
                      }`,
                      position: {
                        x: 50 + k * 100,
                        y: 200 + (floor.corridors.length + i) * 100,
                      },
                    })),
                  };
                  floor.corridors.push(newCorridor);
                }
              });
              updateBuildingInCollection(updatedBuilding);
              assistantResponse = `✅ Added ${corridorCount} corridor${
                corridorCount > 1 ? "s" : ""
              } to each floor.`;
            }
            break;
        }

        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: assistantResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsProcessing(false);
        return;
      }

      // Default help response
      let assistantResponse: string;
      if (buildingCollection.buildings.length > 0) {
        const currentBuilding = building
          ? `**Current Building:** ${building.name} (${building.totalFloors} floors)`
          : "**No building selected**";
        assistantResponse =
          `❓ I couldn't understand your request. ${currentBuilding}\n\n` +
          `**📋 Quick Commands:**\n\n` +
          `**🏗️ Building Management:**\n` +
          `• "Create Building Name with X floors"\n` +
          `• "Switch to Building Name"\n` +
          `• "List all buildings"\n\n` +
          `**➕ Add Components:**\n` +
          `• "Add 2 more floors"\n` +
          `• "Add 1 restroom to floor 3"\n` +
          `• "Add 2 corridors"\n\n` +
          `**✏️ Rename:**\n` +
          `• "Rename building to New Name"\n` +
          `• "Rename Floor 1 to Lobby"\n` +
          `• "Rename all floors to [Ground, First, Second]"\n\n` +
          `**💬 Need Help?**\n` +
          `• "Show available commands" - See all commands\n` +
          `• "Help" - Get detailed assistance`;
      } else {
        assistantResponse =
          `❓ I couldn't understand your building requirements. Please specify:\n\n` +
          `**📋 Create Your First Building:**\n` +
          `• "Create Building A with 5 floors"\n` +
          `• "Create default building"\n` +
          `• "Create Office Complex with 3 floors, 2 restrooms, 1 corridor per floor"\n\n` +
          `**💡 Tips:**\n` +
          `• You can create multiple buildings and switch between them\n` +
          `• Use "Show available commands" to see all options\n` +
          `• Buildings are automatically saved`;
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: assistantResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsProcessing(false);
    },
    [
      building,
      buildingCollection,
      parseShowCommands,
      parseListBuildings,
      parseBuildingSwitch,
      parseBulkRename,
      parseFloorRename,
      parseRestroomRename,
      parseCorridorRename,
      parseBuildingNameChange,
      parseEditCommand,
      parseUserMessage,
      generateBuilding,
      findBuildingByName,
      updateBuildingInCollection,
      addBuildingToCollection,
      switchToBuilding,
    ]
  );

  const uploadMap = useCallback(
    (
      type: "restroom" | "corridor",
      floorId: string,
      componentId: string,
      file: File
    ) => {
      if (!building) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;

        setBuildingCollection((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            buildings: prev.buildings.map((b) => {
              if (b.id !== building.id) return b;

              const updatedBuilding = { ...b };
              updatedBuilding.floors = updatedBuilding.floors.map((floor) => {
                if (floor.id !== floorId) return floor;

                const updatedFloor = { ...floor };

                if (type === "restroom") {
                  updatedFloor.restrooms = updatedFloor.restrooms.map(
                    (restroom) =>
                      restroom.id === componentId
                        ? { ...restroom, map2D: result }
                        : restroom
                  );
                } else {
                  updatedFloor.corridors = updatedFloor.corridors.map(
                    (corridor) =>
                      corridor.id === componentId
                        ? { ...corridor, map2D: result }
                        : corridor
                  );
                }

                return updatedFloor;
              });

              return updatedBuilding;
            }),
          };
        });
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsDataURL(file);
    },
    [building]
  );

  const uploadFixture = useCallback(
    (floorId: string, componentId: string, file: File) => {
      if (!building) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;

        setBuildingCollection((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            buildings: prev.buildings.map((b) => {
              if (b.id !== building.id) return b;

              const updatedBuilding = { ...b };
              updatedBuilding.floors = updatedBuilding.floors.map((floor) => {
                if (floor.id !== floorId) return floor;

                const updatedFloor = { ...floor };
                updatedFloor.restrooms = updatedFloor.restrooms.map(
                  (restroom) =>
                    restroom.id === componentId
                      ? { ...restroom, fixtureDetails: result }
                      : restroom
                );

                return updatedFloor;
              });

              return updatedBuilding;
            }),
          };
        });
      };

      reader.readAsDataURL(file);
    },
    [building]
  );

  const deleteMap = useCallback(
    (type: "restroom" | "corridor", floorId: string, componentId: string) => {
      if (!building) return;

      setBuildingCollection((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          buildings: prev.buildings.map((b) => {
            if (b.id !== building.id) return b;

            const updatedBuilding = { ...b };
            updatedBuilding.floors = updatedBuilding.floors.map((floor) => {
              if (floor.id !== floorId) return floor;

              const updatedFloor = { ...floor };

              if (type === "restroom") {
                updatedFloor.restrooms = updatedFloor.restrooms.map(
                  (restroom) =>
                    restroom.id === componentId
                      ? { ...restroom, map2D: undefined }
                      : restroom
                );
              } else {
                updatedFloor.corridors = updatedFloor.corridors.map(
                  (corridor) =>
                    corridor.id === componentId
                      ? { ...corridor, map2D: undefined }
                      : corridor
                );
              }

              return updatedFloor;
            });

            return updatedBuilding;
          }),
        };
      });
    },
    [building]
  );

  const deleteFixture = useCallback(
    (floorId: string, componentId: string) => {
      if (!building) return;

      setBuildingCollection((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          buildings: prev.buildings.map((b) => {
            if (b.id !== building.id) return b;

            const updatedBuilding = { ...b };
            updatedBuilding.floors = updatedBuilding.floors.map((floor) => {
              if (floor.id !== floorId) return floor;

              const updatedFloor = { ...floor };
              updatedFloor.restrooms = updatedFloor.restrooms.map((restroom) =>
                restroom.id === componentId
                  ? { ...restroom, fixtureDetails: undefined }
                  : restroom
              );

              return updatedFloor;
            });

            return updatedBuilding;
          }),
        };
      });
    },
    [building]
  );

  const updateBuilding = useCallback(
    (updatedBuilding: Building) => {
      updateBuildingInCollection(updatedBuilding);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "assistant",
          content:
            "✅ Building configuration updated successfully! You can continue to modify components or upload 2D maps.",
          timestamp: new Date(),
        },
      ]);
    },
    [updateBuildingInCollection]
  );

  const clearBuilding = useCallback(() => {
    setBuildingCollection({ buildings: [], activeBuilding: null });
    const defaultMessages = getDefaultMessages();
    setMessages(defaultMessages);
    localStorage.removeItem(STORAGE_KEYS.BUILDINGS);
    saveToStorage(STORAGE_KEYS.MESSAGES, defaultMessages);
  }, []);

  return {
    building,
    buildingCollection,
    messages,
    isProcessing,
    sendMessage,
    uploadMap,
    updateBuilding,
    uploadFixture,
    deleteMap,
    deleteFixture,
    clearBuilding,
    switchToBuilding,
  };
};
