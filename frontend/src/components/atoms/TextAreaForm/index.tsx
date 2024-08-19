type Props = { labelText: string; labelId: string } & JSX.IntrinsicElements['textarea'];

export const TextAreaForm = ({ labelText, labelId, rows = 16, value, onChange }: Props) => {
  return (
    <>
      <label
        htmlFor={labelId}
        className='block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left'
      >
        <span className='font-bold'>{labelText}</span>
      </label>
      <textarea
        id={labelId}
        rows={rows}
        className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none'
        value={value}
        onChange={onChange}
      />
    </>
  );
};
