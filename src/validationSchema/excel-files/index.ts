import * as yup from 'yup';

export const excelFileValidationSchema = yup.object().shape({
  file_name: yup.string().required(),
  upload_date: yup.date().required(),
  user_id: yup.string().nullable(),
});
