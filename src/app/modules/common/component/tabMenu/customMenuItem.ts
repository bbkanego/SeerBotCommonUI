import {MenuItem} from 'primeng/primeng';

export interface CustomMenuItem extends MenuItem {
  id: string;
  queryParams?: any;
}
