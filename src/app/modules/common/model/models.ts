export class Option {
  value:string;
  label:string;


  constructor(value:string, label:string) {
    this.value = value;
    this.label = label;
  }
}

export interface Account {
  userName: string;
}

export interface ChatData {
  id: string;
  message: string;
  response: string;
  accountId: string;
  chatSessionId: string;
  previousChatId: string;
  currentSessionId: object;
  uniqueClientId: string;
}
