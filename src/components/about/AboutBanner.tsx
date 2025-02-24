import Image from "next/image"
import Link from "next/link"


interface AboutProps {
  name: string
  image: string
  title: string
  description: string
  link: { text: string; url: string }
}

export default function AboutBanner({ image, title, description, link }: AboutProps) {
  return (
    <section>
      {/* <div className="lg:text-h2 text-h2Lg text-center pt-10 lg:font-bold uppercase">{name}</div> */}
      <div className="w-full h-[800px] relative mt-10">
        <Image src={image || "/placeholder.svg"} alt={title} layout="fill" objectFit="cover" quality={100} priority />
        <div className="absolute inset-0 flex justify-center text-white text-center bg-black/50">
          <div className="pt-24">
            <h1 className="text-4xl font-bold">{title}</h1>
            <p className="text-lg mt-2">{description}</p>
          </div>
        </div>
        <div className="absolute inset-0">
          <Link href={link.url}>
            <div className="absolute bottom-36 right-0 lg:py-9 py-7 lg:px-[150px] px-24 bg-[#1E1E1E] text-white">
              <h2 className="lg:text-xl font-light border-b border-b-white">{link.text}</h2>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

