export type MenuItem = {
  image: string;
  link: string;
  title: string;
  description: string;
};

export type InfiniteMenuProps = {
  items?: MenuItem[];
  scale?: number;
  className?: string;
};
