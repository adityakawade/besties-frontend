import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Card from '../../shared/Card';
import SmallButton from '../../shared/SmallButton';



const FriendRequest = () => {
  return (
    <Card title="Friend Request" divider>
      <div>
        <Swiper
          slidesPerView={4}
          spaceBetween={30}
          className="mySwiper"
          breakpoints={{
            0: {
              slidesPerView: 2,
            },
            640: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {
            Array(5).fill(0).map((item, index) => (
              <SwiperSlide key={index}>

                <div className='flex flex-col items-center gap-2 border border-gray-100 p-3 rounded-lg'>
                  <img src="/images/avt.jpg" alt="" className='w-20 h-20 object-cover  rounded-full' />

                  <h1 className='text-base font-medium text-black'>Er Aditya</h1>
                  <SmallButton icon='user-add-fill' type='success'>Add</SmallButton>

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


