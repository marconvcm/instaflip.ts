import { Broadcaster } from "./Broadcaster";

export class StatusBarController {

   public element: HTMLElement;

   private redElement: HTMLElement;
   
   private blueElement: HTMLElement;

   constructor(
      private window: Window,
      private broadcaster: Broadcaster
   ) {
      this.element = this.window.document.createElement("div");
      this.element.classList.add("status-bar");

      this.redElement = this.window.document.createElement("div");
      this.redElement.classList.add("red");

      this.blueElement = this.window.document.createElement("div");
      this.blueElement.classList.add("blue");

      this.element.appendChild(this.redElement);
      this.element.appendChild(this.blueElement);
   }

   public init(targetElement: HTMLElement) {
      targetElement.appendChild(this.element);
   }

   public update(numberOfRed: number, numberOfBlue: number) {
      
      let redRatio = numberOfRed / numberOfBlue;
      let blueRatio = numberOfBlue / numberOfRed;

      console.log(redRatio, blueRatio);

      this.redElement.style.flexGrow = `${redRatio}`;
      this.blueElement.style.flexGrow = `${blueRatio}`;

      this.redElement.innerHTML = `<span>${numberOfRed}</span>`;
      this.blueElement.innerHTML = `<span>${numberOfBlue}</span>`;
   }
}
