import type { Dispatch, SetStateAction } from "react";

interface buildPaginationLayoutParams {
  page: number;
  pageRange: number;
  siblingCount: number;
}

interface PaginationButtonProps {
  value: number | string;
  ariaLabel: string;
  onClick: () => void;
  isDisabled: boolean;
  isActive: boolean;
}

interface PaginationProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pageRange: number;
  className?: string;
}

const Pagination = ({
  page,
  setPage,
  pageRange,
  className,
}: PaginationProps) => {
  const layout = buildPaginationLayout({ page, pageRange, siblingCount: 3 });

  const paginationElement = layout.map((layoutPage, index) => (
    <PaginationButton
      key={index}
      value={layoutPage}
      ariaLabel={
        layoutPage == page ? `Page ${layoutPage}` : `Go to page ${layoutPage}`
      }
      onClick={() => setPage(layoutPage - 1)}
      isDisabled={!layoutPage}
      isActive={layoutPage == page}
    ></PaginationButton>
  ));

  return (
    <nav
      className={`flex items-center justify-center xl:col-span-2 xl:max-w-screen-lg ${className}`}
      aria-label="Schedule navigation"
    >
      <ul className="list-style-none flex gap-2">
        <PaginationButton
          key={"«"}
          value={"«"}
          ariaLabel={"Go to previous page"}
          onClick={() => setPage((page) => page - 1)}
          isDisabled={page == 1}
          isActive={false}
        ></PaginationButton>
        {paginationElement}
        <PaginationButton
          key={"»"}
          value={"»"}
          ariaLabel={"Go to next page"}
          onClick={() => setPage((page) => page + 1)}
          isDisabled={page == pageRange}
          isActive={false}
        ></PaginationButton>
      </ul>
    </nav>
  );
};

const PaginationButton = ({
  value,
  ariaLabel,
  onClick,
  isDisabled,
  isActive,
}: PaginationButtonProps) => {
  return (
    <li>
      <button
        className={`relative block h-8 w-8
        rounded border-0 outline-none focus:border-blue-300 focus:ring
        focus:ring-blue-200 focus:ring-offset-2
        ${
          !isDisabled && !isActive
            ? `text-slate-900 transition-all hover:bg-blue-100`
            : ""
        }
        ${isDisabled ? "text-slate-400" : ""}
        ${isActive ? `bg-blue-400 text-white hover:bg-blue-400` : ""}`}
        onClick={onClick}
        disabled={isDisabled}
        aria-label={ariaLabel}
      >
        {value ? value : "..."}
      </button>
    </li>
  );
};

function buildPaginationLayout({
  page,
  pageRange,
  siblingCount,
}: buildPaginationLayoutParams) {
  const layout: number[] = [];
  let tempPage = 0;

  if (pageRange <= 5 + siblingCount * 2) {
    for (let i = 1; i <= pageRange; i++) layout.push(i);
    return layout;
  }

  if (page - siblingCount - 1 >= 3) {
    layout.push(1, 0);
    for (let i = siblingCount; i >= 1; i--) {
      layout.push(page - i);
    }
  } else {
    for (let i = 1; i <= 2 + siblingCount; i++) {
      layout.push(i);
    }
    tempPage = 2 + siblingCount + 1;
  }

  if (tempPage) page = tempPage;
  layout.push(page);

  if (pageRange - (page + siblingCount) >= 3) {
    for (let i = 1; i <= siblingCount; i++) {
      layout.push(page + i);
    }
    layout.push(0, pageRange);
  } else {
    layout.splice(-(1 + siblingCount)); // delete page, and right siblings
    for (let i = 2 + siblingCount + 1; i >= 0; i--) {
      layout.push(pageRange - i);
    }
  }
  return layout;
}

export default Pagination;
