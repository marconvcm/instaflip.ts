import { Broadcaster } from './Broadcaster';
import { CardComponent } from './CardComponent';
import { Power } from './Power';

export type Card = {
   name: string,
   img: string, 
   color: string,
   powers: [Compass: Power]
}

export function powerMaker(value: number): Power {
   return {
      absolute: value,
      label: value == 10 ? "A" : `${value}`
   }
}

export function cardBuilder(window: Window, card: Card, flip: boolean, broadcaster: Broadcaster, isUserInteractive: Boolean): CardComponent {
   const cardComponent = new CardComponent(window, card, broadcaster, isUserInteractive);
   cardComponent.toggle(flip);
   return cardComponent;
}
