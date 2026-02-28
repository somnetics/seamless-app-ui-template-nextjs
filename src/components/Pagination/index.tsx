import React, { SetStateAction } from "react";
import DropDown from "@/components/Dropdown";

// define column type
type PaginationType = {
	total: number;
	limit: number;
	currentPage: number;
	onPageChange: React.Dispatch<SetStateAction<number>>;
	onLimitChange: React.Dispatch<SetStateAction<number>>;
	siblingCount: number;
}

export default function Pagination({
	total,
	limit,
	currentPage,
	onPageChange,
	onLimitChange,
	siblingCount = 1,
}: PaginationType) {
	const totalPages = Math.ceil(total / limit);

	const generatePagination = () => {
		const pages = [];
		const leftSibling = Math.max(currentPage - siblingCount, 1);
		const rightSibling = Math.min(currentPage + siblingCount, totalPages);

		// Always include first page
		if (leftSibling > 1) {
			pages.push(1);
			if (leftSibling > 2) pages.push("...");
		}

		for (let i = leftSibling; i <= rightSibling; i++) {
			pages.push(i);
		}

		// Always include last page
		if (rightSibling < totalPages) {
			if (rightSibling < totalPages - 1) pages.push("...");
			pages.push(totalPages);
		}

		return pages;
	};

	// if (totalPages === 0) return null;

	return (
		<div className="grid grid-cols-3 gap-2">
			<div className="flex items-center text-slate-700 dark:text-slate-200">
				{total > 0
					? `Showing ${currentPage * limit - (limit - 1)} 
               to ${limit * currentPage > total
						? total
						: limit * currentPage} 
               of ${total} records`
					: "No record found"}
			</div>

			<div className="flex items-center justify-center gap-2">
				{/* First */}
				<button
					disabled={currentPage === 1}
					onClick={() => onPageChange(1)}
					className="px-3 py-1 border rounded disabled:opacity-40"
				>
					{"<<"}
				</button>

				{/* Prev */}
				<button
					disabled={currentPage === 1}
					onClick={() => onPageChange(currentPage - 1)}
					className="px-3 py-1 border rounded disabled:opacity-40"
				>
					{"<"}
				</button>

				{/* Page Numbers */}
				{generatePagination().map((page, index) =>
					page === "..." ? (
						<span key={index} className="px-2">
							...
						</span>
					) : (
						<button
							key={index}
							onClick={() => onPageChange(Number(page))}
							className={`px-3 py-1 border rounded ${page === currentPage
								? "bg-blue-500 text-white"
								: "hover:bg-gray-100"
								}`}
						>
							{page}
						</button>
					)
				)}

				{/* Next */}
				<button
					disabled={currentPage === totalPages}
					onClick={() => onPageChange(currentPage + 1)}
					className="px-3 py-1 border rounded disabled:opacity-40"
				>
					{">"}
				</button>

				{/* Last */}
				<button
					disabled={currentPage === totalPages}
					onClick={() => onPageChange(totalPages)}
					className="px-3 py-1 border rounded disabled:opacity-40"
				>
					{">>"}
				</button>
			</div>

			<div className="flex items-center justify-end gap-2">
				{/* Page Size Selector */}
				Show <DropDown
					className="w-auto"
					options={[
						{ label: "10", value: "10" },
						{ label: "20", value: "20" },
						{ label: "50", value: "50" },
						{ label: "100", value: "100" },
					]}
					esize="sm"	
					value={limit}
					onChange={(e) => onLimitChange(Number(e.target.value))}
				/>
			</div>
		</div>
	);
}