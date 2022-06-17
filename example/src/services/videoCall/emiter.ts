
class Emitter {
    protected events: any = {}

    constructor() {
      this.events = {};
    }
  
    emit(event: any, ...args:any) {
      if (this.events[event]) {
        this.events[event].forEach((fn: any) => fn(...args));
      }
      return this;
    }
  
    on(event: any, fn: any) {
      if (this.events[event]) this.events[event].push(fn);
      else this.events[event] = [fn];
      return this;
    }
  
    off(event: any, fn: any) {
      if (event && typeof fn === 'function' ) {
        const listeners = this.events[event];
        const index = listeners.findIndex((_fn: any) => _fn === fn);
        listeners.splice(index, 1);
      } else this.events[event] = [];
      return this;
    }
  }
  
  export default Emitter;
  