interface IndexCellProps {
  // w-40
  className: string;
  children: React.ReactNode;
}

function IndexCellDefault({ className, children }: IndexCellProps) {
  return (
    <p className={`flex h-full items-center px-2 ${className}`}>
      <span className="truncate">{children}</span>
    </p>
  );
}

export default IndexCellDefault;
