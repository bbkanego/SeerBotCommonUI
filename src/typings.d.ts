/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
  id: string;
}

// https://medium.com/@NetanelBasal/typescript-integrate-jquery-plugin-in-your-project-e28c6887d8dc
interface JQuery {
  treed(o: any): any;

  tooltip(o: any): any;
}

/* SystemJS module definition */
/* declare var module: {
  id: string;
}; */

//declare module 'stompjs';
//declare module 'sockjs-client';
