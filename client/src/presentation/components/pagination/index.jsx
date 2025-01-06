import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function PaginationFooter({ page, handlePrev,handleNext, totalPages }) {
    console.log(totalPages,page)
    return (<Pagination className="absolute bottom-0   w-full">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious className={page == 1 ? "pointer-events-none opacity-50":undefined} onClick={handlePrev} />
          </PaginationItem>
          <PaginationItem>
                <div>{page} / { totalPages}</div>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext className={page == totalPages ? "pointer-events-none opacity-50":undefined} onClick={handleNext}/>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      )
};