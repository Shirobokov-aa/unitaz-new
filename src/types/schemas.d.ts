type Link = {
  name: string;
  url: string;
};

type ImageBlock = {
  src: string;
  alt: string;
  desc: string;
};

type SectionData = {
  title?: string;
  description?: string;
  link?: Link;
  images_block?: ImageBlock[];
  images?: string[];
};
