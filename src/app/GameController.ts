import { DeckController } from "./DeckController";
import { BoardController } from "./BoardController";
import { Broadcaster } from "./Broadcaster";
import { Card } from "./Card";
import { CardComponent } from "./CardComponent";
import { SlotComponent } from "./SlotComponent";
import { TurnController, TurnOwner } from "./TurnController";

export const RED = "red";
export const BLUE = "blue";

export class GameController {

   private playerDeck: DeckController
   private otherDeck: DeckController
   private board: BoardController
   private turns: TurnController

   private cardSelected: CardComponent | null;
   private slotSelected: SlotComponent | null;

   private cards: Array<any> = [];

   constructor(
      private window: Window, 
      private broadcaster: Broadcaster
   ) {
      this.playerDeck = new DeckController(this.window, "player", this.broadcaster, TurnOwner.PLAYER);
      this.otherDeck = new DeckController(this.window, "other", this.broadcaster, TurnOwner.OPPONENT);
      this.board = new BoardController(this.window, this.broadcaster);
      this.turns = new TurnController(this.broadcaster);
   }

   init(targetElement: HTMLElement) {
      this.otherDeck.init(targetElement);
      this.board.init(targetElement);
      this.playerDeck.init(targetElement);
      this.initListeners();
      setTimeout(() => {
         this.turns.next();   
      }, 100);
   }

   initListeners() {
      
      this.broadcaster.listen("NEW_PLAYER_CARD", (card: Card) => {

         let next = { ...card, color: "blue" };

         this.playerDeck.push(next, false);
         this.cards.push(next);

         this.calculatePoints();
      });
      
      this.broadcaster.listen("NEW_OTHER_CARD", (card: Card) => {
         let next = { ...card, color: "red" };

         this.otherDeck.push(next, false);
         this.cards.push(next);

         this.calculatePoints();
      });

      this.broadcaster.listen("CARD_SELECTED", (cardComponent: CardComponent) => {
         this.cardSelected = cardComponent;
      });

      this.broadcaster.listen("SLURP", (slotComponent: SlotComponent) => {
         this.slotSelected = slotComponent;
         this.listenSlurp();
      });

      this.broadcaster.listen("FLIP_DONE", this.calculatePoints.bind(this));

      this.broadcaster.listen("SLURP_DONE", () => {
         this.turns.next();
      });
   }
   
   private listenSlurp() {
      if(this.slotSelected && this.cardSelected) {
         
         this.slotSelected.place(this.cardSelected);
         this.cardSelected.blur();
         
         this.broadcaster.emit(
            "SLURP_DONE", 
            this.slotSelected
         );

         this.cardSelected = null;
         this.slotSelected = null;
      }
   }

   private numberOfCards(color: string) {
      return this.cards.filter(card => card.color == color).length;
   }

   private calculatePoints() {
      this.board.updateStatusBar(this.numberOfCards(RED), this.numberOfCards(BLUE));
   }
}
