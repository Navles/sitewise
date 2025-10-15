export interface Lift {
  id: string;
  position: { x: number; y: number };
}

export interface Restroom {
  id: string;
  name: string;
  position: { x: number; y: number };
  map2D?: string;
  fixtureDetails?: string;
}

export interface Corridor {
  id: string;
  name: string;
  position: { x: number; y: number };
  lifts: Lift[];
  map2D?: string;
}

export interface Floor {
  id: string;
  number: number;
  name?: string;
  restrooms: Restroom[];
  corridors: Corridor[];
}

export interface Building {
  id: string;
  name: string;
  totalFloors: number;
  floors: Floor[];
}

export interface BuildingCollection {
  buildings: Building[];
  activeBuilding: string | null;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}