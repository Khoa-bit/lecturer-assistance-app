interface IndexCellProps {
  // w-40
  className: string;
  children: React.ReactNode;
}

function IndexHeaderCell({ className, children }: IndexCellProps) {
  return <p className={`h-full truncate px-2 ${className}`}>{children}</p>;
}

export default IndexHeaderCell;
