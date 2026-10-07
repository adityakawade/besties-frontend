import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Card from '../../shared/Card';
import SmallButton from '../../shared/SmallButton';
import Fetcher from '../../../lib/fetcher';
import useSWR, { mutate } from 'swr'
import { Empty, Skeleton } from 'antd';
import { catchError } from '../../../lib/catchError';
import HttpInterceptor from '../../../lib/HttpInterceptor';
import toast from 'react-hot-toast';


const FriendRequest = () => {

  const { data, error, isLoading } = useSWR("/friend/request", Fetcher)

  if (isLoading) {
    return <Skeleton />
  }

  if (error) {
    return <Empty />
  }



  console.log(data);

  const acceptFriendRequest = async (id: string) => {
    try {
      await HttpInterceptor.put(`/friend/${id}`, { status: "accepted" })
      toast.success("Friend Request Accepted")
      mutate('/friend/request')
      mutate('/friend')
      mutate('/friend/suggestion')
    } catch (error) {
      catchError(error)
    }
  }

  return (
    <Card title="Friend Request" divider>
      <div>
        {
          data.length === 0 &&
          <Empty />
        }
        <Swiper
          slidesPerView={2}
          spaceBetween={30}
          className="mySwiper"

        >
          {
            data && data.map((item: any, index: number) => (
              <SwiperSlide key={index}>

                <div className='flex flex-col items-center gap-2 border border-gray-100 p-3 rounded-lg'>
                  <img src="/images/avt.jpg" alt="" className='w-20 h-20 object-cover  rounded-full' />

                  <h1 className='text-base font-medium text-black capitalize'>{item.user.fullname}</h1>
                  <SmallButton onClick={() => acceptFriendRequest(item._id)} icon='check-double-line' type='success'>Accept</SmallButton>

                </div>

              </SwiperSlide>
            ))
          }

        </Swiper>
      </div>
    </Card>
  );
}


export default FriendRequest


