import { css } from '@emotion/react';
import { TextInput, Textarea, Select, Group, Button, rem } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useNavigate } from 'react-router-dom'
import { useForm, yupResolver } from '@mantine/form';
import * as Yup from 'yup';
import '@mantine/dates/styles.css';
import { IconCalendar } from '@tabler/icons-react';
import { maxScreen } from '../mediaQueries';


const validationSchema = Yup.object().shape({
  title: Yup.string().required('タイトルは必須です'),
  entry_conditions: Yup.string().required('応募条件は必須です'),
});

const enumOptions = [
  { value: 'entertainment', label: 'エンタメ部門' },
  { value: 'serious', label: 'キレイ部門' },
];

const AddContest = () => {

  const Styles = {
    LogoStyle: css ({
      fontSize: '18px',
      fontWeight: 'bold',
      textAlign: 'center',
      minHeight: '40px',
      marginBottom: '30px',
    }),
    ContainerStyle: css ({
      maxWidth: '620px',
      width: '90%',
      // height: '100vh',
      marginLeft: 'auto',
      marginRight: 'auto',
    }),
    ButtonStyles: css({
      marginTop: '30px',
    }),
    InputBoxStyle: css ({
      margin: '20px 0',
    }),
    HeldStyle: css ({
      margin: '20px 0',
      marginLeft: '20px',
      [maxScreen('lg')]:{
        marginLeft: '0',
        justifyContent: 'space-between',
      },
    }),
  };

  const navigate = useNavigate();

  const form = useForm({
    validate: yupResolver(validationSchema),
    initialValues: {
      title: '',
      description: '',
      entry_conditions: '',
      start_date: '',
      end_date: '',
      department: '',
      // departmentLabel: '',
    },
  });

  const handleSubmit = async (values: any) => {
    const formData = {
      title: values.title,
      description: values.description,
      start_date: values.start_date,
      end_date: values.end_date,
      department: values.department,
      entry_conditions: values.entry_conditions,
    };
    navigate('/contest/new/confirm', { state: { formData: formData } })
  };

  const icon = <IconCalendar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;

  return (
    <div css={Styles.ContainerStyle}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <h1 css={Styles.LogoStyle}>コンテストを開催する</h1>
          <TextInput
            withAsterisk
            label="タイトル"
            {...form.getInputProps('title')}
          />
          <Textarea
            css={Styles.InputBoxStyle}
            size="sm"
            label="開催内容"
            name="description"
            {...form.getInputProps('description')}
          />
          開催期間
          <Group css={Styles.HeldStyle}>
            <DateInput
            className='max-lg:w-40'
              clearable
              leftSection={icon}
              valueFormat="YYYY年MM月DD日"
              label="開始日"
              {...form.getInputProps('start_date')}
            />
            <div className='mt-6 mx-2'> 〜 </div>
            <DateInput
              className='max-lg:w-40'
              clearable
              leftSection={icon}
              valueFormat="YYYY年MM月DD日"
              label="終了日"
              {...form.getInputProps('end_date')}
            />
            </Group>
          <Select
            css={Styles.InputBoxStyle}
            label="開催部門"
            placeholder="部門を選択"
            data={['エンタメ部門', 'キレイ部門']}
            {...form.getInputProps('department')}
          />
          <TextInput
            css={Styles.InputBoxStyle}
            withAsterisk
            label="応募条件"
            {...form.getInputProps('entry_conditions')}
          />
          <Button
            css={Styles.ButtonStyles}
            type="submit"
            variant="outline"
            color="rgba(59, 59, 59, 1)"
          >
            確認する
          </Button>
      </form>
    </div>
  )
};

export default AddContest
