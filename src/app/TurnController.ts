import { Broadcaster } from "./Broadcaster";

export enum TurnOwner {
   PLAYER = "PLAYER", 
   OPPONENT = "OPPONENT"
}

export class TurnController {

   private currentOwner: TurnOwner | null = null;
   private currentTurn: number = 0

   constructor(private broadcaster: Broadcaster) { }

   public next() {
      this.currentTurn = this.currentTurn + 1;
      this.toggleOwner();

      this.broadcaster.emit("NEXT_TURN", { 
         owner: this.currentOwner, 
         turn: this.currentTurn 
      });
   }
   
   private toggleOwner() {
      
      switch(this.currentOwner) {
         case TurnOwner.OPPONENT:
            this.currentOwner = TurnOwner.PLAYER;
            break;
         case TurnOwner.PLAYER:
            this.currentOwner = TurnOwner.OPPONENT;
            break;
         default: 
            this.currentOwner = TurnOwner.PLAYER;
            break;
      }
   }
}