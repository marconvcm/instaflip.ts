import frontFaceSvg from 'bundle-text:../assets/card-frame.svg';
import backFaceSvg from 'bundle-text:../assets/board-background.svg';
import { Card } from './Card';
import { Compass } from "./Compass";
import { Broadcaster } from './Broadcaster';


export class CardComponent {
   
   
   public currentColor: string;
   private cardElement: HTMLElement;
   private cardFront: HTMLElement;
   private cardBack: HTMLElement;

   constructor(private window: Window, private card: Card, private broadcaster: Broadcaster, private isUserInteractive: Boolean) {

      let img = window.document.createElement("img") as HTMLImageElement;
      img.style.backgroundImage = `url(${card.img})`;

      let cardElement = window.document.createElement("div");
      cardElement.classList.add("card");

      let cardFront = window.document.createElement("div");
      cardFront.classList.add("front-face");

      let cardBack = window.document.createElement("div");
      cardBack.classList.add("back-face");

      cardBack.innerHTML = backFaceSvg;

      cardFront.innerHTML = frontFaceSvg;
      cardFront.prepend(img);

      [Compass.NORTH, Compass.EAST, Compass.SOUTH, Compass.WEST].forEach(orientation => {
         let text = cardFront.querySelector(`[data-orientation=${orientation}] text`) as SVGTextElement;
         text.textContent = card.powers[orientation].label;
      });

      cardElement.appendChild(cardBack);
      cardElement.appendChild(cardFront);

      this.cardElement = cardElement;
      this.cardFront = cardFront;
      this.cardBack = cardBack;

      this.cardElement.addEventListener('click', () => this.select());

      this.flip(card.color);
   }

   public select() {
      if (this.isUserInteractive) {
         this.broadcaster.emit("CARD_SELECT", this);
         this.broadcaster.emit("CARD_SELECTED", this);
         this.cardElement.classList.add("selected");
      }
   }

   public blur() {
      this.cardElement.classList.remove("selected");
   }

   public flip(color: string) {
      this.cardElement.classList.remove(this.currentColor);
      this.currentColor = this.card.color =  color;
      this.cardElement.classList.add(color);
   }

   public flipRed() { 
      this.flip("red"); 
   }
   
   public flipBlue() { 
      this.flip("blue"); 
   }

   public toggle(hidden: boolean) {
      this.cardFront.hidden = hidden;
      this.cardBack.hidden = !hidden;
   }

   public enabled(enabled: boolean): void {
      this.isUserInteractive = enabled;
   }

   public element(): HTMLElement {
      return this.cardElement;
   }

   public attack(targetCard: CardComponent, targetCompass: Compass, sourceCompass: Compass): boolean {
      return this.card.powers[sourceCompass].absolute > targetCard.card.powers[targetCompass].absolute;
   }
}
