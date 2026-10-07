import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Card from '../../shared/Card';
import SmallButton from '../../shared/SmallButton';
import useSWR, { mutate } from 'swr'
import Fetcher from '../../../lib/fetcher';
import { Empty, Skeleton } from 'antd';
import { catchError } from '../../../lib/catchError';
import HttpInterceptor from '../../../lib/HttpInterceptor';
import toast from 'react-hot-toast';


const FriendSuggestion = () => {

    const { data, error, isLoading } = useSWR('/friend/suggestion', Fetcher)

    if (isLoading) {
        return <Skeleton active />
    }

    if (error) {
        return <Empty />
    }

    const sendFriendRequest = async (id: string) => {
        try {
            const { data } = await HttpInterceptor.post('/friend', { friend: id })
            mutate('/friend/suggestion')
            mutate("/friend")
            toast.success(data.message)

        } catch (error) {
            catchError(error)
        }
    }

    return (
        <Card title="Suggestion" divider>

            {
                data.length === 0 &&
                <Empty/>
            }
            <div>
                <Swiper
                    slidesPerView={2}
                    spaceBetween={30}
                    className="mySwiper"

                >
                    {
                        data && data.map((item: any, index: number) => (
                            <SwiperSlide key={index}>

                                <div className='flex flex-col items-center gap-2 border border-gray-100 p-3 rounded-lg'>
                                    <img src={item.image || "/images/avt.jpg"} alt="" className='w-20 h-20 object-cover  rounded-full' />

                                    <h1 className='text-base font-medium text-black'>{item.fullname}</h1>
                                    <SmallButton onClick={() => sendFriendRequest(item._id)} icon='user-add-fill' type='success'>Add</SmallButton>

                                </div>

                            </SwiperSlide>
                        ))
                    }

                </Swiper>
            </div>
        </Card>
    );
}


export default FriendSuggestion