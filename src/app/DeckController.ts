import { Broadcaster } from "./Broadcaster";
import { Card, cardBuilder } from "./Card";
import { CardComponent } from "./CardComponent";
import { TurnOwner } from "./TurnController";

export class DeckController {

   private element: HTMLElement
   private deck: Array<CardComponent> = []

   constructor(
      private window: Window, 
      private tag: string,
      private broadcaster: Broadcaster, 
      private owner: TurnOwner
   ) {}

   init(targetElement: HTMLElement) {
      this.element = this.window.document.createElement("div");
      this.element.classList.add("deck", this.tag);

      targetElement.appendChild(this.element);

      this.broadcaster.listen("CARD_SELECT", (slot) => this.unselectAll())

      this.broadcaster.listen("NEXT_TURN", ({ owner: nextOwner, _ }) => {
         console.log(this.owner, nextOwner);
         this.setEnable(nextOwner == this.owner);
      });
   }
   
   private setEnable(enabled: boolean) {
      this.deck.forEach(card => card.enabled(enabled));
   }
   
   private unselectAll() {
      this.deck.forEach((card) => card.blur());
   }

   public push(card: Card, flip: boolean) {
      const cardComponent = cardBuilder(this.window, card, flip, this.broadcaster, !flip);

      this.deck.push(cardComponent);
      this.element.appendChild(cardComponent.element());
   }
}