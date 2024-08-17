type Props = {
  needsMargin?: boolean;
  children: React.ReactNode;
};

export const BaseFormBox = ({ needsMargin = true, children }: Props) => {
  return <div className={needsMargin ? 'mt-8' : ''}>{children}</div>;
};
