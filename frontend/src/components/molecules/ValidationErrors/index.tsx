type Props = {
  messages: string[];
};

export const ValidationErrors = ({ messages }: Props) => {
  return (
    <>
      <div className='w-full pt-5 text-left'>
        {messages.map((message, i) => (
          <p key={i} className='text-red-400'>
            {message}
          </p>
        ))}
      </div>
    </>
  );
};
