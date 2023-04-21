interface IndexCellProps {
  // w-40
  className: string;
  children: React.ReactNode;
}

function IndexFooterCell({ className, children }: IndexCellProps) {
  return <p className={`h-full truncate px-2 ${className}`}>{children}</p>;
}

export default IndexFooterCell;
