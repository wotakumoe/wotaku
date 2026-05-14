/** @jsx react-jsx **/

type OgImageTemplateProps = {
  title: string
  image: string
}

export function OgImageTemplate({ title, image }: OgImageTemplateProps) {
  return (
    <div tw='w-full h-full bg-black flex flex-col relative overflow-hidden font-[Inter]'>
      <img tw='absolute inset-0 w-full h-full object-cover' src={image} />
      <div tw='relative z-1 p-10 w-full min-h-0 grow flex flex-col items-center justify-between'>
        <div tw='w-full flex justify-between items-center text-5xl font-medium'>
          <div tw='flex items-center'>
            <div tw='text-zinc-100 ml-2 mt-1 font-semibold'>wotaku.wiki</div>
          </div>
        </div>
        <div tw='w-full pr-56 flex flex-col items-start justify-end'>
          <div tw='text-[#f7f7f7] text-6xl font-bold'>{title}</div>
        </div>
      </div>
      <div tw='shrink-0 h-2 w-full flex' />
    </div>
  )
}
