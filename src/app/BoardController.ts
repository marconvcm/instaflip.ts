import { getCompass, getOppositeCompass } from "./Compass";
import { SlotComponent } from "./SlotComponent";
import { StatusBarController } from "./StatusBarController";
import { Broadcaster } from "./Broadcaster";
import { formatString, _div, _span, _tree } from "./Utils";
import { TurnOwner } from "./TurnController";

const SLOTS = [
   "1A", "1B", "1C",
   "2A", "2B", "2C",
   "3A", "3B", "3C"
];

const EDGES = {
   "1A": {
      "east": "1B",
      "south": "2A"
   },
   "1B": {
      "west": "1A",
      "east": "1C",
      "south": "2B"
   },
   "1C": {
      "west": "1B",
      "south": "2C"
   },
   "2A": {
      "east": "2B",
      "south": "3A",
      "north": "1A",
   },
   "2B": {
      "west": "2A",
      "east": "2C",
      "south": "3B",
      "north": "1B",
   },
   "2C": {
      "west": "2B",
      "south": "3C",
      "north": "1C",
   },
   "3A": {
      "east": "3B",
      "north": "2A"
   },
   "3B": {
      "west": "3A",
      "east": "3C",
      "north": "2B"
   },
   "3C": {
      "west": "3B",
      "north": "2C"
   },
}

const TURN_LINE: string = "Turn: {0}";

export class BoardController {
   
   private arrow: HTMLElement;
   private arrowDisplay: HTMLElement;
   private statusBar: StatusBarController;
   private turnDisplay: HTMLElement;
   private element: HTMLElement;
   private boardElement: HTMLElement;
   private slots: Array<SlotComponent> = [];

   constructor(private window: Window, private broadcaster: Broadcaster) { 
      this.statusBar = new StatusBarController(this.window, this.broadcaster);
   }

   init(targetElement: HTMLElement) {
      
      this.element =       _div(this.window.document, "board-controller");
      this.boardElement =  _div(this.window.document, "board");
      this.arrow =        _span(this.window.document, "arrow-down", "right");
      this.arrowDisplay =  _div(this.window.document, "arrow-display");
      this.turnDisplay =   _div(this.window.document, "turn-display");

      _tree(
         targetElement,
         _tree(
            this.element,
            this.boardElement,
            this.statusBar.element,
            this.turnDisplay,
            _tree(
               this.arrowDisplay, 
               this.arrow
            )      
         )
      )
      
      for (const slot of SLOTS) {
         let slotComponent = new SlotComponent(slot, this.window, this.broadcaster);
         this.boardElement.appendChild(slotComponent.element());
         this.slots.push(slotComponent);
      }

      for (const slotId in EDGES) {
         let sourceSlot = this.getSlotById(slotId);
         const element = EDGES[slotId];
         for (const compassKey in element) {
            const nextSlot = this.getSlotById(element[compassKey]);
            const compass = getCompass(compassKey);
            sourceSlot.edgeTo(nextSlot, compass);
         }
      }

      this.broadcaster.listen("SLURP_DONE", (slot) => this.processSlurpResult(slot));

      this.broadcaster.listen("NEXT_TURN", ({ owner, turn }) => {
         this.updateTurnDisplay(owner, turn);
      });
   }
   
   public getSlotById(id: string): SlotComponent {
      let [result] = this.slots.filter(slot => slot.getId() == id);
      return result;
   }

   public updateStatusBar(numberOfRed: number, numberOfBlue: number) {
      this.statusBar.update(numberOfRed, numberOfBlue);
   }

   private processSlurpResult(slot: SlotComponent): any {
      slot.tryFlipAdjacent();
      this.broadcaster.emit("FLIP_DONE", slot);
   }

   private updateTurnDisplay(owner: any, turn: any) {
      this.turnDisplay.innerText = formatString(TURN_LINE, turn);
      switch(owner) {
         case TurnOwner.PLAYER:
            this.moveArrow("right");            
            break;
         case TurnOwner.OPPONENT:
            this.moveArrow("left");
            break;
      }
   }
   
   private moveArrow(position: string) {
      this.arrow.classList.remove("right", "left");
      this.arrow.classList.add(position);
   }
}
