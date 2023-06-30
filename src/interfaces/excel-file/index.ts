import { ScoreInterface } from 'interfaces/score';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ExcelFileInterface {
  id?: string;
  file_name: string;
  upload_date: any;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  score?: ScoreInterface[];
  user?: UserInterface;
  _count?: {
    score?: number;
  };
}

export interface ExcelFileGetQueryInterface extends GetQueryInterface {
  id?: string;
  file_name?: string;
  user_id?: string;
}
