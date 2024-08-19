type Props = {
  src: string;
  alt: string;
  widthStyle: string;
  additionalImageStyle?: string;
};

export const BookImage = ({ src, alt, widthStyle, additionalImageStyle = '' }: Props) => {
  return (
    <>
      <div className={`flex ${widthStyle} justify-center items-center`}>
        <div className={`w-24 h-32 relative flex items-center ${additionalImageStyle}`}>
          <img src={src} alt={alt} width='80%' height='80%' />
        </div>
      </div>
    </>
  );
};
