import { ExcelFileInterface } from 'interfaces/excel-file';
import { GetQueryInterface } from 'interfaces';

export interface ScoreInterface {
  id?: string;
  student_name: string;
  subject: string;
  score: number;
  excel_file_id?: string;
  created_at?: any;
  updated_at?: any;

  excel_file?: ExcelFileInterface;
  _count?: {};
}

export interface ScoreGetQueryInterface extends GetQueryInterface {
  id?: string;
  student_name?: string;
  subject?: string;
  excel_file_id?: string;
}
