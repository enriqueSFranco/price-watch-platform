export function isPageNumber(page: number | string): page is number {
	return typeof page === 'number';
}

export function generatePageNumbers({
	currentPage,
	totalPages,
}: {
	currentPage: number;
	totalPages: number;
}): (number | string)[] {
	const pages: (number | string)[] = [];
	const numItemsToShow = 5; // Siempre 5 elementos

	// Caso 1: Total de páginas es menor o igual a 5
	if (totalPages <= numItemsToShow) {
		for (let page = 1; page <= totalPages; page++) {
			pages.push(page);
		}
		return pages;
	}

	// Caso 2: Cerca del inicio (páginas 1, 2, 3)
	if (currentPage <= 3) {
		for (let page = 1; page <= 4; page++) {
			pages.push(page);
		}
		pages.push('...');
		return pages;
	}

	// Caso 3: Cerca del final (páginas totalPages - 2, totalPages - 1, totalPages)
	if (currentPage >= totalPages - 2) {
		pages.push('...');
		for (let page = totalPages - 3; page <= totalPages; page++) {
			pages.push(page);
		}
		return pages;
	}

	// Caso 4: En el medio
	pages.push('...');
	for (let page = currentPage - 1; page <= currentPage + 1; page++) {
		pages.push(page);
	}
	pages.push('...');
	return pages;
}
