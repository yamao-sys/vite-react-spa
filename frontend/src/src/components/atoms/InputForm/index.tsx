type Props = { labelText: string; labelId: string } & JSX.IntrinsicElements['input'];

export const InputForm = ({ labelText, labelId, type = 'text', value, onChange }: Props) => {
  return (
    <>
      <label
        htmlFor={labelId}
        className='block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left'
      >
        <span className='font-bold'>{labelText}</span>
      </label>
      <input
        id={labelId}
        type={type}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        value={value}
        onChange={onChange}
      />
    </>
  );
};
