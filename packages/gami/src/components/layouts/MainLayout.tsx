import { Menu } from "@headlessui/react";
import { Transition } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuthContext } from "src/lib/auth_client";

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  const { userPerson, signOut, pbClient } = useAuthContext();
  const person = userPerson?.expand?.person;
  const router = useRouter();

  console.log(
    pbClient.buildUrl(`api/files/people/${person?.id}/${person?.avatar}`)
  );

  return (
    <>
      <header className="flex w-screen items-center justify-center bg-white drop-shadow-lg">
        <nav>
          <ol className="flex gap-4 py-4">
            <Link
              className="p-1 font-bold hover:text-blue-600"
              href={"/eventDocuments"}
            >
              Events
            </Link>
            <Link
              className="p-1 font-bold hover:text-blue-600"
              href={"/academicMaterials"}
            >
              Academic Materials
            </Link>
            <Link
              className="p-1 font-bold hover:text-blue-600"
              href={"/people"}
            >
              People
            </Link>
            <Link
              className="p-1 font-bold hover:text-blue-600"
              href={"/relationships"}
            >
              Contacts
            </Link>
            <Link
              className="p-1 font-bold hover:text-blue-600"
              href={"/lectureCourses"}
            >
              Lecture Courses
            </Link>
            <Link
              className="p-1 font-bold hover:text-blue-600"
              href={"/adviseClasses"}
            >
              Advise Classes
            </Link>
            <Link
              className="p-1 font-bold hover:text-blue-600"
              href={"/personalNotes"}
            >
              Personal Notes
            </Link>
          </ol>
        </nav>
        <div className="dropdown-end dropdown pl-4">
          <label
            tabIndex={0}
            className="flex cursor-pointer items-center rounded-full border-2 bg-blue-500 p-1 font-bold text-white hover:bg-blue-400"
          >
            <Image
              className="mr-2 h-9 w-9 rounded-full"
              src={pbClient.buildUrl(
                `api/files/people/${person?.id}/${person?.avatar}?thumb=36x36`
              )}
              alt="Uploaded avatar"
              width={36}
              height={36}
            />
            {person?.name}
            <span className="material-symbols-rounded">expand_more</span>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded bg-base-100 p-2 shadow"
          >
            <li>
              <Link
                className={
                  "rounded py-1 px-2 hover:bg-blue-500 hover:text-white"
                }
                href={`/people/${person?.id}`}
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                className={"rounded py-1 px-2 hover:bg-error hover:text-white"}
                onClick={() => {
                  signOut().then(() => {
                    router.reload();
                  });
                }}
              >
                Log out
              </button>
            </li>
          </ul>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col py-8 px-4">
        {children}
      </main>
    </>
  );
}
