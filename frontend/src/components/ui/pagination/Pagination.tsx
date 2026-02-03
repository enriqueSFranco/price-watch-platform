import { Button } from '../../desing-system/Button/button';
import { generatePageNumbers, isPageNumber } from './utils';
import styles from './pagination.module.css';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
	const pages = generatePageNumbers({
    currentPage: Number(currentPage),
    totalPages,
  });

	return (
		<nav className="grid place-content-center" role="navigation" aria-label="pagination navigation">
			<ul className="flex items-center">
				<li>
					<Button
						variant="ghost"
						aria-label="page prev"
						color="secondary"
						disabled={currentPage === 1}
						onClick={() => onPageChange(currentPage - 1)}
						data-pagination-button="pagination-prev"
						data-testid="pagination-prev"
					>
						left
					</Button>
				</li>
				{pages.map((page, idx) => (
					<li key={`pagination-page-${page}-${idx}`}>
						{isPageNumber(page) ? (
							<Button
                variant={currentPage === page ? 'contained' : 'ghost'}
								color="secondary"
								onClick={() => onPageChange(page)}
								data-pagination-page={page}
								data-testid={`pagination-page-${page}`}
								aria-current={currentPage === page ? 'page' : undefined}
							>
								{page}
							</Button>
						) : (
							<span data-pagination-ellipsis data-testid="pagination-ellipsis" className={styles.ellipsis} aria-hidden="true" role="presentation">
								{page}
							</span>
						)}
					</li>
				))}
				<li>
					<Button
						variant="ghost"
						aria-label="Página siguiente"
						disabled={currentPage === totalPages}
						color="secondary"
						onClick={() => onPageChange(currentPage + 1)}
						data-pagination-button="next"
						data-testid="pagination-next"
					>
						right
					</Button>
				</li>
			</ul>
		</nav>
	);
}
