const Fallback = () => {
  return (
    <div className='flex flex-col h-screen w-screen items-center justify-center z-30 bg-[#f5f3f0] dark:bg-gradient-to-b dark:from-[#111111] dark:to-[#555555] absolute top-0'>
      <div className='absolute left-4 top-7 sm:left-8 sm:top-8'>
        <a href='/'>
          <img src='/icons/logo50.png' alt='logo' className='w-[34px] h-[34px] object-contain' />
        </a>
      </div>
      <div className='flex w-screen justify-center items-center  '>
        <img src='/icon-196x196.png' className='h-[80px] w-[80px]' alt='logo' />
      </div>
      <div className='items-center text-center justify-center flex font-raleway font-[700] text-[35px] mt-2'>
        Нет доступа к интернету
      </div>

      <div className='items-center justify-center text-center mx-10 flex font-raleway text-[20px] mt-5 leading-8'>
        <p>Похоже, вы не подключены к сети. Проверьте настройки и повторите попытку.</p>
      </div>
    </div>
  )
}

export default Fallback
