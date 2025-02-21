"use client"

interface AboutSectionProps {
  title: string;
  description: string;
}

export default function AboutShower({ title, description }: AboutSectionProps) {
  return (
    <section>
      <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-48">
        <div>
          <h2 className="lg:text-h2 text-h2Lg">{title}</h2>
          <p className="lg:text-[32px] lg:font-light lg:leading-[169%] pt-12">{description}</p>
        </div>
      </div>
    </section>
  );
}
