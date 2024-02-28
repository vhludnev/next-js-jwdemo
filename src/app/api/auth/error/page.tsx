'use client'

import { useSearchParams } from 'next/navigation'

export default function ErrorPage() {
  const searchParams = useSearchParams()

  const error = searchParams.get('error')

  return (
    <div className='grid min-h-[80vh] place-items-center w-full z-30 bg-primary-white'>
      <div className='text-center'>
        <p className='text-xl font-semibold text-yellow-600 dark:text-emerald-500 px-5'>{error}</p>

        <div className='mt-10 text-base leading-7 text-zinc-500 dark:text-zinc-400'>
          <button className='bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
            <a href='/auth' className='link link-accent  '>
              Авторизоваться
            </a>
          </button>
        </div>
      </div>
    </div>
  )
}
