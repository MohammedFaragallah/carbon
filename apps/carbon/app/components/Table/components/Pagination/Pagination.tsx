import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useKeyboardShortcuts,
} from "@carbon/react";
import { useRef } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

export type PaginationProps = {
  count: number;
  offset: number;
  pageIndex: number;
  pageSize: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageCount: number;
  gotoPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
};

const Pagination = (props: PaginationProps) => {
  const { pageSize, setPageSize } = props;

  const pageSizes = [15, 25, 50, 100];
  const pageSizeLabel = "results per page";
  if (!pageSizes.includes(pageSize)) {
    pageSizes.push(pageSize);
    pageSizes.sort();
  }

  return (
    <HStack
      className="text-center bg-background border-t border-border justify-between px-4 py-2 w-full z-[1]"
      spacing={6}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            {pageSize} {pageSizeLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Results per page</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={`${pageSize}`}>
            {pageSizes.map((size) => (
              <DropdownMenuRadioItem
                key={`${size}`}
                value={`${size}`}
                onClick={() => {
                  setPageSize(size);
                }}
              >
                {size} {pageSizeLabel}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <HStack>
        <PaginationButtons {...props} />
      </HStack>
    </HStack>
  );
};

export const PaginationButtons = ({
  condensed = false,
  canNextPage,
  canPreviousPage,
  count,
  nextPage,
  offset,
  pageSize,
  previousPage,
}: PaginationProps & { condensed?: boolean }) => {
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);

  useKeyboardShortcuts({
    j: (event: KeyboardEvent) => {
      event.stopPropagation();
      nextButtonRef.current?.click();
    },
    f: (event: KeyboardEvent) => {
      event.stopPropagation();
      previousButtonRef.current?.click();
    },
  });

  return (
    <>
      {condensed ? (
        <>
          <IconButton
            aria-label="Previous"
            icon={<BsChevronLeft />}
            isDisabled={!canPreviousPage}
            onClick={previousPage}
            variant="secondary"
          />
          <IconButton
            aria-label="Next"
            icon={<BsChevronRight />}
            isDisabled={!canNextPage}
            onClick={nextPage}
            variant="secondary"
          />
        </>
      ) : (
        <TooltipProvider>
          <div className="text-foreground flex text-sm font-medium align-center">
            {count > 0 ? offset + 1 : 0} - {Math.min(offset + pageSize, count)}{" "}
            of {count}
          </div>
          <Tooltip>
            <TooltipTrigger>
              <Button
                ref={previousButtonRef}
                variant="secondary"
                isDisabled={!canPreviousPage}
                onClick={previousPage}
                leftIcon={<BsChevronLeft />}
              >
                Previous
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <HStack>F</HStack>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button
                ref={nextButtonRef}
                variant="secondary"
                isDisabled={!canNextPage}
                onClick={nextPage}
                rightIcon={<BsChevronRight />}
              >
                Next
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <HStack>J</HStack>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};

export default Pagination;
