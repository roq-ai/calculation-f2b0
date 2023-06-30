import * as yup from 'yup';

export const scoreValidationSchema = yup.object().shape({
  student_name: yup.string().required(),
  subject: yup.string().required(),
  score: yup.number().integer().required(),
  excel_file_id: yup.string().nullable(),
});
