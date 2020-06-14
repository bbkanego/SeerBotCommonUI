export class Option {
  value: string;
  label: string;


  constructor(value: string, label: string) {
    this.value = value;
    this.label = label;
  }
}

export interface Account {
  userName: string;
}

export class Login {
  username = '';
  password = '';
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
  authCode: string;
}

/**
 * Chart data set
 * example:
 * {
      label: 'apples',
      data: [12, 19, 3, 17, 6, 3, 7],
      backgroundColor: "rgba(153,255,51,0.4)"
    }
 * */
export interface ChartDataSet {
  label: string;
  data: number[];
  backgroundColor?: any;
  borderColor?: any;
  fill?: boolean;
}

// used by the Chart component
export interface ChartData {
  type: string;
  labels: string[];
  dataSets: ChartDataSet[];
  options?: {};
}
