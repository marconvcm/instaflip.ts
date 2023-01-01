import { Broadcaster } from "./Broadcaster";
import { powerMaker } from "./Card";
import { GameController } from "./GameController";
import cards from '../cardset.json';

const defaultBroadcaster = new Broadcaster();
const gameController = new GameController(window, defaultBroadcaster);

const mainElement = window.document.getElementById("app") as HTMLElement;

gameController.init(mainElement);

let cardSet1 = cards.sort(() => (Math.random() > 0.5) ? 1 : -1).slice(0, 5);
let cardSet2 = cards.sort(() => (Math.random() > 0.5) ? 1 : -1).slice(0, 5);

for (const card of cardSet1) {
   defaultBroadcaster.emit("NEW_PLAYER_CARD",
      {
         name: card.name,
         img: card.img,
         powers: {
            "north": powerMaker(card.north),
            "east": powerMaker(card.east),
            "south": powerMaker(card.south),
            "west": powerMaker(card.west)
         }
      },
   );
}

for (const card of cardSet2) {
   defaultBroadcaster.emit("NEW_OTHER_CARD",
      {
         name: card.name,
         img: card.img,
         powers: {
            "north": powerMaker(card.north),
            "east": powerMaker(card.east),
            "south": powerMaker(card.south),
            "west": powerMaker(card.west)
         }
      },
   );
}

window['gameController'] = gameController;
