import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import { FileInput, TextInput, Textarea, Group, Button, Select } from '@mantine/core';
import '../assets/AddPhoto.css'
import { IconUpload } from '@tabler/icons-react';
import { Link } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext';
import { useForm, yupResolver } from '@mantine/form';
import * as Yup from 'yup';
import { toast } from 'react-toastify'
import { useCategory } from '../context/Category';
import { maxScreen } from '../mediaQueries';


const validationSchema = Yup.object().shape({
  title: Yup.string().required('作品名は必須です'),
  photo_img: Yup.string().required('写真を選択してください'),

});

const AddPhoto = (props: any) => {
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
      marginLeft: 'auto',
      marginRight: 'auto',
    }),
    NoticeStyle: css ({
      fontSize: '1em',
      fontWeight: 'bold',
      fontFamily: 'Bodoni',
      color: 'red',
      minHeight: '40px',
      marginLeft: '0px',
    }),
    FormStyle: css ({
      fontWeight: 'bold',
    }),
    InputBoxStyle: css ({
      margin: '20px 0',
    }),
    CommentStyles: css({
      fontSize: '14px',
      color: 'gray',
    }),
    ButtonStyles: css({
      margin: '30px 100px',
      [maxScreen('lg')]: {
      margin: '30px 20px',
      }
    }),
    ImageFrameStyle: css ({
      height: '32rem',
      width: '100%',
    })
  }

  const { user } =  UserAuth() as { user: object };
  const { categories } = useCategory();

  const navigate = useNavigate();

  const form = useForm({
    validate: yupResolver(validationSchema),
    initialValues: {
      title: '',
      description: '',
      category: '',
    },
  });

  const handleSubmit = async (values: any) => {

    const formData = new FormData();
      formData.append('photo[title]',  values.title);
      formData.append('photo[description]',  values.description);
      formData.append('photo[category]', values.category);
      formData.append('photo[photo_img]', values.photo_img)
    try {
      const token = await user.getIdToken(true);
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const resp = await axios.post(`${import.meta.env.VITE_BASE_URL}/photos`, formData, config)
      toast.success('写真を投稿しました！')

      if (props.contest) {
        const data = {
          contest_id: props.contest.id,
          photo_id: resp.data.id,
        };
        await axios.post(`${import.meta.env.VITE_BASE_URL}/contest_entries`, data, config);
        toast.success('コンテストに応募しました！')
      }
      navigate('/')
      }catch (error) {
      console.log('エラー:', error);
      console.log('エラーコード:', (error as any).code);
      console.log('エラーメッセージ:', (error as any).message);
      alert('エラーが発生しました: ' + error.message);
      if (error.response) {
        // サーバーからのレスポンスがある場合
        const errorMessage = error.response.data.errors[0]; // エラーメッセージの取得
        alert(errorMessage); // アラートでメッセージを表示
      } else {
        // サーバーからのレスポンスがない場合
        alert('エラーが発生しました');
      }
    }
  };

  return (
    <div css={Styles.ContainerStyle}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <h1 css={Styles.LogoStyle}>写真をアップロードする</h1>
        <p css={Styles.NoticeStyle}>※ 著作権等の知的財産権や肖像権の侵害にご注意ください</p>
        <div>
          <FileInput
            label="作品写真"
            description="※アップロードできる１枚あたりの容量 [ 40MB以下 ]"
            withAsterisk
            size="md"
            radius="sm"
            {...form.getInputProps('photo_img')}
            placeholder="写真を選択する"
            accept="image/*,.png,.jpg,.jpeg,.gif"
          />
        </div>
        <div css={Styles.InputBoxStyle}>
          <TextInput
            withAsterisk
            size="md"
            label="作品名"
            {...form.getInputProps('title')}
          />
        </div>
        <div>
          <Select
            label="カテゴリー"
            size="md"
            clearable
            data={categories}
            {...form.getInputProps('category')}
          />
        </div>
        <div css={Styles.InputBoxStyle}>
          <Textarea
            size="md"
            label="作品説明"
            {...form.getInputProps('description')}
          />
        </div>
    {/* -----別にタスクで追加-------------- */}
        {/* <div css={Styles.InputBoxStyle}>
          <p>カメラ</p>
          <p css={Styles.CommentStyles} className='indent-3' >この項目は写真選択後に表示されます。</p>
        </div>
        <div css={Styles.InputBoxStyle}>
          <p>レンズ</p>
          <p css={Styles.CommentStyles} className='indent-3' >この項目は写真選択後に表示されます。</p>
        </div> */}
    {/* *********本リリース時に追加************** */}
        {/* <div css={Styles.InputBoxStyle}>
        <TagsInput
          label="撮影シーン"
          placeholder="設定したいワード(例：夜景、iphoneで撮影)"
          defaultValue={['夜景']}
          clearable
        />
        </div> */}
        {/* <div>
          <p>撮影地</p>
          <p css={Styles.CommentStyles} className='indent-3' >この項目は写真選択後に表示されます。</p>
        </div> */}
    {/* -----別にタスクで追加-------------- */}
        <div css={Styles.ButtonStyles}>
          <Group justify="space-between">
            <Link to='/'>
              <Button
                variant="outline"
                color="rgba(59, 59, 59, 1)"
              >
              キャンセルする
              </Button>
            </Link>
            <Button
              type="submit"
              variant="outline"
              color="rgba(59, 59, 59, 1)"
              rightSection={<IconUpload size={14} />}
            >
              アップロードする
            </Button>
          </Group>
        </div>
      </form>
    </div>
  )}

export default AddPhoto
