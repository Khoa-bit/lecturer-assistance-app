import Link from "next/link";

interface IndexCellProps {
  // w-40
  className: string;
  href: string;
  children: React.ReactNode;
}

function IndexCell({ className, href, children }: IndexCellProps) {
  return (
    <Link className={`flex h-full items-center px-2 ${className}`} href={href}>
      <span className="truncate">{children}</span>
    </Link>
  );
}

export default IndexCell;
