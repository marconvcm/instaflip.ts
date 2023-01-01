import { v4 as uuid } from 'uuid';

export class Broadcaster {

   private inverseMap = {};
   private channels = new Map();

   emit(channel, object) {
      console.log(channel);
      const listeners = this.channels.get(channel);
      
      if(!listeners) { 
         console.warn('channel "' + channel + '" has no listeners');
         return;
      }
      
      for (const key in listeners) {
         if (Object.hasOwnProperty.call(listeners, key)) {
            const listener = listeners[key];
            listener(object);
         }
      }
   }

   listen(channel, callback) {
      let listeners = (this.channels.get(channel) || {});
      let id = uuid();
      this.inverseMap[id] = channel;
      listeners[id] = callback;
      this.channels.set(channel, listeners);
      return id;
   }

   cancel(id) {
      const channel = this.inverseMap[id];
      let listeners = this.channels.get(channel);
      delete listeners[id];
      delete this.inverseMap[id];
      this.channels.set(channel, listeners);
   }

   watch(name, defaultValue) {
      let handler = {
         set: (object, prop, value) => {
            object[prop] = value;
            this.emit(`proxy.${name}.${prop}.changed`, object[prop]);
            return true;
         }
      }
      return new Proxy(defaultValue, handler);
   }
}
