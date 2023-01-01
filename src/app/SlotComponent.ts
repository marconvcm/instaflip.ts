import { Compass, getOppositeCompass } from "./Compass";
import { Broadcaster } from "./Broadcaster";
import { CardComponent } from "./CardComponent";

export class SlotComponent {
   
   private slotElement: HTMLElement;
   private edges: Map<Compass, SlotComponent> = new Map();
   private card: CardComponent | null;

   constructor(private id: string, private window: Window, private broadcaster: Broadcaster) {
      let slot = this.window.document.createElement("div");
      
      slot.classList.add("slot");
      this.slotElement = slot;
      this.card = null;

      this.slotElement.addEventListener('click', () => this.slurp());
   }

   public getId() {
      return this.id;
   }

   public element(): HTMLElement {
      return this.slotElement;
   }

   public edgeTo(nextSlot: SlotComponent, compass: Compass) {
      this.edges.set(compass, nextSlot);
   }

   public slurp() {
      this.broadcaster.emit("SLURP", this);
   }

   public place(card: CardComponent) {
      let cardElement = card.element();
      cardElement.parentElement?.removeChild(cardElement);
      this.element().appendChild(cardElement);
      this.card = card;
   }

   public tryFlipAdjacent() {
      this.edges.forEach(this.attack.bind(this));
   }

   private hit(targetColor: string) {
      this.card && this.card.flip(targetColor); 
   }

   private attack(targetSlot: SlotComponent, sourceCompass: Compass) {
      
      if (!targetSlot.card) { return }

      const targetCard = targetSlot.card,
            sourceCard = this.card!;

      const targetCompass = getOppositeCompass(sourceCompass);

      if(sourceCard.attack(targetCard, targetCompass, sourceCompass)) {
         targetSlot.hit(sourceCard.currentColor);
      }
   }
}
