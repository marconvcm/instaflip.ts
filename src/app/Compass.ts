
export enum Compass {
   NORTH = "north",
   EAST = "east",
   SOUTH = "south",
   WEST = "west"
}

export function getCompass(input: string): Compass {
   switch(input) {
      case "north": return Compass.NORTH;
      case "east": return Compass.EAST;
      case "south": return Compass.SOUTH;
      case "west": return Compass.WEST;
      default: throw new Error('unknown compass string');
   }
}

export function getOppositeCompass(input: Compass): Compass {
   switch(input) {
      case Compass.NORTH: return Compass.SOUTH;
      case Compass.EAST: return Compass.WEST;
      case Compass.SOUTH: return Compass.NORTH;
      case Compass.WEST: return Compass.EAST;
   }
}