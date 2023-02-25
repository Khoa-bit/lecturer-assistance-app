import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <>
      <aside>
        <nav>
          <ol className="flex gap-2">
            <Link className="text-blue-700 underline" href={"/eventDocuments"}>
              Events
            </Link>
            <Link className="text-blue-700 underline" href={"/fullDocuments"}>
              Full Documents
            </Link>
            <Link className="text-blue-700 underline" href={"/people"}>
              People
            </Link>
            <Link className="text-blue-700 underline" href={"/lectureCourses"}>
              Lecture Courses
            </Link>
            <Link className="text-blue-700 underline" href={"/adviseClasses"}>
              Advise Classes
            </Link>
            <Link className="text-blue-700 underline" href={"/"}>
              Home
            </Link>
          </ol>
        </nav>
      </aside>
      <main>{children}</main>
    </>
  );
}
