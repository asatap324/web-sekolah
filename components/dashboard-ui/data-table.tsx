"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconEdit,
  IconGripVertical,
  IconTrash,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useBlogs } from "@/hooks/use-blogs";
import { useRouter } from "next/navigation";

export const schema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.array(z.string()),
  created_at: z.preprocess(
    (val) => (val == null ? null : new Date(String(val))),
    z.date().nullable(),
  ),
});

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Button variant="link" className="text-foreground w-fit px-0 text-left">
        {row.original.title}
      </Button>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      // Be resilient: Supabase may return created_at as string, number, or Date
      const raw: unknown = (row.original as any).created_at;
      let d: Date | null = null;

      if (raw instanceof Date) {
        d = raw;
      } else if (raw) {
        // Try to coerce string/number to Date and validate
        const candidate = new Date(typeof raw === "number" ? raw : String(raw));
        d = isNaN(candidate.getTime()) ? null : candidate;
      }

      return (
        <div className="w-40 truncate">
          {d
            ? d.toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-"}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.category.map((category: string) => (
          <Badge
            key={category}
            variant="outline"
            className="text-muted-foreground px-1.5"
          >
            {category}
          </Badge>
        ))}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { deleteBlog } = useBlogs();
      const blog = row.original;
      const router = useRouter();

      const handleDelete = async () => {
        if (!confirm(`Yakin ingin menghapus blog "${blog.title}"?`)) return;
        try {
          await deleteBlog(blog.id);
          router.refresh(); // reload data tabel setelah delete
        } catch (err: any) {
          console.error(err);
          toast.error(err.message);
        }
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem asChild>
              <Link
                className="flex items-center"
                href={`/dashboard/articles/${blog.id}/edit`}
              >
                <IconEdit size={16} aria-hidden="true" />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              <IconTrash size={16} aria-hidden="true" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [activeFilter, setActiveFilter] = React.useState("all");
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  // Filter data based on created_at
  const filteredData = React.useMemo(() => {
    if (activeFilter === "all") return data;

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    return data.filter((item) => {
      if (!item.created_at) return false;

      const itemDate = new Date(item.created_at);
      if (isNaN(itemDate.getTime())) return false;

      switch (activeFilter) {
        case "today":
          return itemDate >= startOfDay;
        case "yesterday":
          const yesterday = new Date(startOfDay);
          yesterday.setDate(yesterday.getDate() - 1);
          return itemDate >= yesterday && itemDate < startOfDay;
        case "last7days":
          const weekAgo = new Date(startOfDay);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return itemDate >= weekAgo;
        case "last30days":
          const monthAgo = new Date(startOfDay);
          monthAgo.setDate(monthAgo.getDate() - 30);
          return itemDate >= monthAgo;
        default:
          return true;
      }
    });
  }, [data, activeFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  // Reset pagination when filter changes
  React.useEffect(() => {
    table.setPageIndex(0);
  }, [activeFilter, table]);

  return (
    <Tabs
      className="w-full flex-col justify-start gap-6"
      value={activeFilter}
      onValueChange={setActiveFilter}
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="last7days">Last 7 Days</SelectItem>
            <SelectItem value="last30days">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
          <TabsTrigger value="last7days">Last 7 Days</TabsTrigger>
          <TabsTrigger value="last30days">Last 30 Days</TabsTrigger>
        </TabsList>
      </div>

      {["all", "today", "yesterday", "last7days", "last30days"].map(
        (filterValue) => (
          <TabsContent
            key={filterValue}
            value={filterValue}
            className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
          >
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-muted-foreground text-center">
                  <div className="text-lg font-medium mb-2">No data found</div>
                  <div className="text-sm">
                    {activeFilter === "all"
                      ? "No items available"
                      : `No items found for ${filterValue === "last7days" ? "last 7 days" : filterValue === "last30days" ? "last 30 days" : filterValue}`}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-lg border">
                  <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                    id={sortableId}
                  >
                    <Table>
                      <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                              return (
                                <TableHead
                                  key={header.id}
                                  colSpan={header.colSpan}
                                >
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                      )}
                                </TableHead>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody className="**:data-[slot=table-cell]:first:w-8">
                        {table.getRowModel().rows?.length ? (
                          <SortableContext
                            items={dataIds.filter((id) =>
                              filteredData.some((item) => item.id === id),
                            )}
                            strategy={verticalListSortingStrategy}
                          >
                            {table.getRowModel().rows.map((row) => (
                              <DraggableRow key={row.id} row={row} />
                            ))}
                          </SortableContext>
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center"
                            >
                              No results.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </DndContext>
                </div>
                <div className="flex items-center justify-between px-4">
                  <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                  </div>
                  <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                      <Label
                        htmlFor="rows-per-page"
                        className="text-sm font-medium"
                      >
                        Rows per page
                      </Label>
                      <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                          table.setPageSize(Number(value));
                        }}
                      >
                        <SelectTrigger className="w-20" id="rows-per-page">
                          <SelectValue
                            placeholder={table.getState().pagination.pageSize}
                          />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                              {pageSize}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                      Page {table.getState().pagination.pageIndex + 1} of{" "}
                      {table.getPageCount()}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                      <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <span className="sr-only">Go to first page</span>
                        <IconChevronsLeft />
                      </Button>
                      <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <span className="sr-only">Go to previous page</span>
                        <IconChevronLeft />
                      </Button>
                      <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                      >
                        <span className="sr-only">Go to next page</span>
                        <IconChevronRight />
                      </Button>
                      <Button
                        variant="outline"
                        className="hidden size-8 lg:flex"
                        size="icon"
                        onClick={() =>
                          table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                      >
                        <span className="sr-only">Go to last page</span>
                        <IconChevronsRight />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        ),
      )}
    </Tabs>
  );
}
