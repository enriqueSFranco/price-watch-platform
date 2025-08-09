import { Button } from "../../atoms/Button/button";
import { IconChevronLeft } from "../../atoms/Icons/icon-chevron-left";
import { IconChevronRight } from "../../atoms/Icons/icon-chevron-right";
import { generatePageNumbers, isPageNumber } from "./utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = generatePageNumbers({
    currentPage: Number(currentPage),
    totalPages,
  });

  const isValidPage = (page: number) => page >= 1 && page <= totalPages && page !== currentPage
  const handlePageChange = (page: number) => {
    // verificamos si es una pagina valida
    if (isValidPage(page))
      onPageChange(page);
  };

  return (
    <nav
      className="grid place-content-center"
      role="navigation"
      aria-label="pagination navigation"
    >
      <ul className="flex items-center">
        <li>
          <Button
            variant="ghost"
            aria-label="page prev"
            color="secondary"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            data-pagination-button="pagination-prev"
            data-testid="pagination-prev"
          >
            <IconChevronLeft aria-hidden="true" />
          </Button>
        </li>
        {pages.map((page, idx) => (
          <li key={`pagination-page-${page}-${idx}`}>
            {isPageNumber(page) ? (
              <Button
                variant={currentPage === page ? "contained" : "ghost"}
                color="secondary"
                onClick={() => onPageChange(page)}
                data-pagination-page={page}
                data-testid={`pagination-page-${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Button>
            ) : (
              <span data-pagination-ellipsis data-testid="pagination-ellipsis" role="presentation">{page}</span>
            )}
          </li>
        ))}
        <li>
          <Button
            variant="ghost"
            aria-label="next page"
            disabled={currentPage === totalPages}
            color="secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            data-pagination-button="next"
            data-testid="pagination-next"
          >
            <IconChevronRight aria-hidden="true" />
          </Button>
        </li>
      </ul>
    </nav>
  );
}
