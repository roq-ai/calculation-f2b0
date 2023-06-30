import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getScoreById, updateScoreById } from 'apiSdk/scores';
import { Error } from 'components/error';
import { scoreValidationSchema } from 'validationSchema/scores';
import { ScoreInterface } from 'interfaces/score';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ExcelFileInterface } from 'interfaces/excel-file';
import { getExcelFiles } from 'apiSdk/excel-files';

function ScoreEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ScoreInterface>(
    () => (id ? `/scores/${id}` : null),
    () => getScoreById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ScoreInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateScoreById(id, values);
      mutate(updated);
      resetForm();
      router.push('/scores');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ScoreInterface>({
    initialValues: data,
    validationSchema: scoreValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Score
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="student_name" mb="4" isInvalid={!!formik.errors?.student_name}>
              <FormLabel>Student Name</FormLabel>
              <Input
                type="text"
                name="student_name"
                value={formik.values?.student_name}
                onChange={formik.handleChange}
              />
              {formik.errors.student_name && <FormErrorMessage>{formik.errors?.student_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="subject" mb="4" isInvalid={!!formik.errors?.subject}>
              <FormLabel>Subject</FormLabel>
              <Input type="text" name="subject" value={formik.values?.subject} onChange={formik.handleChange} />
              {formik.errors.subject && <FormErrorMessage>{formik.errors?.subject}</FormErrorMessage>}
            </FormControl>
            <FormControl id="score" mb="4" isInvalid={!!formik.errors?.score}>
              <FormLabel>Score</FormLabel>
              <NumberInput
                name="score"
                value={formik.values?.score}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('score', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.score && <FormErrorMessage>{formik.errors?.score}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<ExcelFileInterface>
              formik={formik}
              name={'excel_file_id'}
              label={'Select Excel File'}
              placeholder={'Select Excel File'}
              fetcher={getExcelFiles}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.file_name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'score',
    operation: AccessOperationEnum.UPDATE,
  }),
)(ScoreEditPage);
