import { useState, useEffect } from 'react'
import axios from 'axios'
import { css } from '@emotion/react'
import { Input, Grid, Select, Image, Text } from '@mantine/core';
import { Link } from 'react-router-dom'
import { FaAngleRight } from "react-icons/fa";
import { useForm } from '@mantine/form';
import { BiSearchAlt } from "react-icons/bi";
import { animated, useChain, useSpring, useSpringRef } from '@react-spring/web'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { PhotoSlider } from './Swiper';
import { useCategory } from '../context/Category';
import { maxScreen } from '../mediaQueries';
import useWindowSize from '../useWindowSize';

const IndexPhotos = () => {

  const Styles = {
    GridStyle: css({
      margin: '1.25rem auto 0 auto',
      width: '83.3%',
      [maxScreen('lg')]: {
        width: '100%',
      },
    }),
  }

  const [images, setImages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({});
  const [photoCount, setPhotoCount] = useState();
  const [photoSearch, setPhotoSearch] = useState(false);
  const [selectedSort, setSelectedSort] = useState('postDesc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { categories } = useCategory();
  const [ windowWidth, windowheght ] = useWindowSize();

  useEffect (() => {
    const handleSlideChange = () => {
      if (currentIndex === images.length - 4) {
        setPage(page + 1);
      }
    };
      handleSlideChange()
  },[currentIndex])

 const handleSlideChange = (index) => {
  setCurrentIndex(index);
};

  const form = useForm({
    initialValues: {
      freeWord: '',
      postUserName: '',
      category: '',
    },
  });

  const options = {
    layout: {
      fillGaps: true, // グリッドの穴埋めを行うかどうか
      horizontal: false, // アイテムを水平に配置するかどうか
    },
  };

    useEffect(() => {
      // axiosでデータを取得する部分は関数化して、利用する
      const fetchData = async () => {
        try {
          const resp = await axios.get(`${import.meta.env.VITE_BASE_URL}/photos?page=${page}`, {
            params: { ...searchParams } // ページ数も追加
          });
          setImages((prevImages) => [...prevImages, ...resp.data.photos]);
          setPhotoCount(resp.data.photo_count)
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error('Error fetching images:', error);
        }
      };
    
      fetchData(); // 初回レンダリング時にもデータを取得
    
      // pageが変更されたときにもデータを取得
    }, [page, searchParams]);


    const sortPhotos = (images, key, order) => {
      return [...images].sort((a, b) => {
        if (order === 'asc') {
          return a[key] > b[key] ? 1 : -1;
        } else {
          return a[key] < b[key] ? 1 : -1;
        }
      });
    };

    const handleSortByPostDateAsc = () => {
      const sortedPhotos = sortPhotos(images, 'created_at', 'asc');
      setImages(sortedPhotos);
    };
    const handleSortByPostDateDesc = () => {
      const sortedPhotos = sortPhotos(images, 'created_at', 'desc');
      setImages(sortedPhotos);
    };
    const handleSortByLikesDesc = () => {
      const sortedPhotos = sortPhotos(images, 'likes_count', 'desc');
      setImages(sortedPhotos);
    };
    
    const handleSubmit = async (values: any) => {
      setPage(1);
      setLoading(true);
      setImages([]);
      setPhotoSearch(true);

      const params = {
        q: {
          title_or_description_or_camera_cont: values.freeWord,
          user_name_cont: values.postUserName,
          category_name_cont: values.category,
        },
      };

      setSearchParams(params)
    };

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);

  //   return () => {
  //     // コンポーネントがアンマウントされるときにイベントリスナーをクリーンアップ
  //     window.removeEventListener('scroll', handleScroll);

  //   };
  // }, []); // 空の依存配列で初回のみ実行

  const ref1 = useSpringRef();
  const ref2 = useSpringRef();

  const heightStyle = useSpring({
    ref: ref1,
    config: { duration: 100 },
  });

  const fadeStyles = useSpring({
    ref: ref2,
    gridTemplateRows: isFormOpen ? '1fr' : '0fr',
  });

  useChain([ref1, ref2], [0, 0.1]);

  if (loading) {
    return <div></div>
  }

  return (
    <div className='h-full'>
      <section>
        <div className='w-10/12 mx-auto pb-px pt-5 transition-all duration-300 max-lg:w-11/12'>
          <form onSubmit={(e) => { setLoading(true); form.onSubmit(handleSubmit)(e); }}>
            <animated.div
              className="flex w-full flex-col  border-main/30 text-main"
              style={heightStyle}
            >
              <Grid grow gutter="xs" css={Styles.GridStyle}>
                <Grid.Col span={12}>
                  <Input.Wrapper label="フリーワード" description="" error="">
                    <Input
                      {...form.getInputProps('freeWord')}
                    />
                  </Input.Wrapper>
                </Grid.Col>
              </Grid>

              <animated.div className="grid" style={fadeStyles}>
                <div className="overflow-hidden">
                <Grid gutter="xs" css={Styles.GridStyle}>
                  <Grid.Col span={6}>
                      <Input.Wrapper label="シーン" description="" error="">
                        <Input  disabled placeholder="本リリースにて実装"/>
                      </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select
                        label="カテゴリー"
                        data={categories}
                        clearable
                        {...form.getInputProps('category')}
                      />
                    </Grid.Col>
                    <Grid.Col span={6} className='mt-4'>
                      <Input.Wrapper label="撮影者" description="" error="">
                        <Input
                          {...form.getInputProps('postUserName')}
                        />
                      </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={6} className='flex-wrap pt-2 mt-4'>
                        <Text className='mb-2'>撮影地</Text>
                        <Link to='/photos/map' className='flex items-center justify-end hover:text-sky-700'>
                          <Text size="md" className='hover:text-sky-700'>地図を開く</Text>
                          <FaAngleRight/>
                        </Link>
                    </Grid.Col>
                  </Grid>
                </div>
              </animated.div>
            </animated.div>
            {/* <Grid grow gutter="xs" className='my-5 w-10/12 mx-auto'> */}
            <Grid grow gutter="xs" css={Styles.GridStyle}>
              <Grid.Col span={1}><div className='mb-1.5 cursor-pointer' onClick={() => {setSelectedSort('postDesc'); handleSortByPostDateDesc()}}><p className={`py-2.5 px-4 hover:text-sky-700 relative after:absolute after:bottom-0 after:left-2.5 after:w-2/4 after:h-0.5 after:bg-sky-600 after:transition-all after:duration-300 after:scale-y-100 after:scale-x-0 after:origin-top-left hover:after:scale-y-100 hover:after:scale-x-100 max-lg:text-sm ${selectedSort === 'postDesc' ? 'after:scale-y-100 after:scale-x-100 text-sky-700' : ''}`}>新着順</p></div></Grid.Col>
              <Grid.Col span={1}><div className='mb-1.5 cursor-pointer' onClick={() => {setSelectedSort('postAsc');handleSortByPostDateAsc()}}><p className={`py-2.5 px-4 hover:text-sky-700 relative after:absolute after:bottom-0 after:left-2.5 after:w-2/4 after:h-0.5 after:bg-sky-600 after:transition-all after:duration-300 after:scale-y-100 after:scale-x-0 after:origin-top-left hover:after:scale-y-100 hover:after:scale-x-100 max-lg:text-sm ${selectedSort === 'postAsc' ? 'after:scale-y-100 after:scale-x-100 text-sky-700' : ''}`}>古い順</p></div></Grid.Col>
              <Grid.Col span={2}><div className='mb-1.5 cursor-pointer' onClick={() => {setSelectedSort('likeDesc'); handleSortByLikesDesc()}}><p className={`py-2.5 px-4 hover:text-sky-700 relative after:absolute after:bottom-0 after:left-2 after:w-3/5 after:h-0.5 after:bg-sky-600 after:transition-all after:duration-300 after:scale-y-100 after:scale-x-0 after:origin-top-left hover:after:scale-y-100 hover:after:scale-x-100 max-lg:text-sm max-lg:px-2  ${selectedSort === 'likeDesc' ? 'after:scale-y-100 after:scale-x-100 text-sky-700' : ''}`}>お気に入り数順</p></div></Grid.Col>
              { windowWidth >= 690 && <Grid.Col span={5}></Grid.Col> }
              <Grid.Col span={1}>
                <button type="submit" className='
                bg-transparent hover:bg-gray-400 text-gray-600 hover:text-white border border-gray-400 hover:border-transparent rounded
                ml-4 mb-4 py-1 px-4 shadow-sm shadow-gray-400 w-10/12 flex transition-all duration-100 active:translate-y-1 active:shadow-none  max-lg:text-sm max-lg:ml-3 max-lg:px-2 max-lg:mt-1 max-lg:w-21'><BiSearchAlt className='mt-1 mr-3 max-lg:mr-2 max-lg:mt-0.8'/>探す</button>
              </Grid.Col>
            </Grid>
          </form>
        <div className='text-center'>
         {!isFormOpen ? (
          <div className='mb-4 max-lg:text-sm'>
            <span className="cursor-pointer"
            onMouseOver={() => setIsHover(true)}
            onMouseOut={() => setIsHover(false)}
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            詳細検索
          </span>
            <div className="flex items-center justify-center pt-1">
              <IconChevronDown className={`cursor-pointer transition-all duration-100 ${isHover ? 'translate-y-1' : ''}`}
              onMouseOver={() => setIsHover(true)}
              onMouseOut={() => setIsHover(false)}
              onClick={() => setIsFormOpen(!isFormOpen)}
              />
            </div>
          </div>
         ):(
          <div className='mb-4'>
            <div className="flex items-center justify-center pb-1 ">
              <IconChevronUp className={`cursor-pointer transition-all duration-100 ${isHover ? '-translate-y-1' : ''}`}
              onMouseOver={() => setIsHover(true)}
              onMouseOut={() => setIsHover(false)}
              onClick={() => setIsFormOpen(!isFormOpen)}
              />
            </div>
            <span className="cursor-pointer max-lg:text-sm"
              onMouseOver={() => setIsHover(true)}
              onMouseOut={() => setIsHover(false)}
              onClick={() => setIsFormOpen(!isFormOpen)}
            >
              表示を減らす
            </span>
          </div>
         )}
        </div>
      </div>
          <div className='flex justify-between items-center mt-2 px-20'>
            <div className=''>
              { photoSearch &&
                <p className='text-center py-2.5'>検索結果： {photoCount} 件</p>
              }
            </div>
          </div>
          </section>
          {/* <section className='h-3/6 my-４ grid' css={Styles.ImageSectionStyle}> */}
          <section className='pt-8 px-4'>
            <PhotoSlider images={images} onSlideChange={handleSlideChange}/>
          </section>
    </div>
  )
}

export default IndexPhotos