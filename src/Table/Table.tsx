import { ArrowLeftIcon, ArrowRightIcon, ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  Table as CTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  NumberInput,
  NumberInputField,
  Input,
  Text,
  Tooltip,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from "@chakra-ui/react";
import {
  useTable,
  Column,
  usePagination,
  useGlobalFilter,
  Row
  } from "react-table";
import { ReactElement, useState } from "react";

interface TableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
}

interface GlobalFilterProps<T extends object> {
  preGlobalFilteredRows: Row<T>[];
  globalFilter: any;
  setGlobalFilter: (filterValue: any) => void;
}

function GlobalFilter<T  extends object>({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: GlobalFilterProps<T>) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = useState(globalFilter)
  const onChange = (value: string) => {
    setGlobalFilter(value || undefined)
  };

  return (
    <Flex alignItems="center">
      Search:
      <Input
        width="12rem"
        ml="1rem"
        className="form-control"
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </Flex>
  );
};

export function Table<T extends object>({ columns, data }: TableProps<T>): ReactElement {
  if (!columns || !data) return <></>;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, globalFilter },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable<T>(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 3
      },
    },
    useGlobalFilter,
    usePagination,
  );

  return (
    <>
      <GlobalFilter<T>
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <CTable {...getTableProps()}>
        <Thead>
          {
            headerGroups.map(headerGroup => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <Th {...column.getHeaderProps()}>{column.render("Header")}</Th>
                ))}
              </Tr>
            ))
          }
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {
            page.map((row: Row<T>) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {
                    row.cells.map((cell) => (
                      <Td {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </Td>
                    ))
                  }
                </Tr>
              )
            })
          }
        </Tbody>
      </CTable>

      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              aria-label="first-page"
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              aria-label="previous-page"
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>

        <Flex alignItems="center">
          <Text flexShrink="0" mr={8}>
            Page{" "}
            <Text fontWeight="bold" as="span">
              {pageIndex + 1}
            </Text>{" "}
            of{" "}
            <Text fontWeight="bold" as="span">
              {pageOptions.length}
            </Text>
          </Text>
          <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={pageOptions.length}
            onChange={(str: string, value: number) => {
              const page = value ? value - 1 : 0;
              gotoPage(page);
            }}
            defaultValue={pageIndex + 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>

        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              aria-label="next-page"
              onClick={nextPage}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              aria-label="last-page"
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={4}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </>
  );
}
