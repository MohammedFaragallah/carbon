import { Enumerable, Hyperlink, MenuIcon, MenuItem } from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsFillPenFill } from "react-icons/bs";
import { TableNew } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Part } from "~/modules/parts";
import { partReplenishmentSystems, partTypes } from "~/modules/parts";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";

type PartsTableProps = {
  data: Part[];
  partGroups: ListItem[];
  count: number;
};

const PartsTable = memo(({ data, count, partGroups }: PartsTableProps) => {
  const navigate = useNavigate();
  const [params] = useUrlParams();
  const permissions = usePermissions();

  const columns = useMemo<ColumnDef<Part>[]>(() => {
    return [
      {
        accessorKey: "id",
        header: "Part ID",
        cell: ({ row }) => (
          <Hyperlink onClick={() => navigate(path.to.part(row.original.id!))}>
            {row.original.id}
          </Hyperlink>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "partType",
        header: "Part Type",
        cell: (item) => <Enumerable value={item.getValue<string>()} />,
        meta: {
          filter: {
            type: "static",
            options: partTypes.map((type) => ({
              value: type,
              label: <Enumerable value={type} />,
            })),
          },
        },
      },
      {
        accessorKey: "replenishmentSystem",
        header: "Replenishment",
        cell: (item) => <Enumerable value={item.getValue<string>()} />,
        meta: {
          filter: {
            type: "static",
            options: partReplenishmentSystems.map((type) => ({
              value: type,
              label: <Enumerable value={type} />,
            })),
          },
        },
      },
      {
        accessorKey: "partGroup",
        header: "Part Group",
        cell: (item) => <Enumerable value={item.getValue<string>()} />,
        meta: {
          filter: {
            type: "static",
            options: partGroups.map(({ id, name }) => ({
              value: id,
              label: <Enumerable value={name} />,
            })),
          },
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const renderContextMenu = useMemo(() => {
    // eslint-disable-next-line react/display-name
    return (row: Part) => (
      <MenuItem onClick={() => navigate(path.to.part(row.id!))}>
        <MenuIcon icon={<BsFillPenFill />} />
        Edit Part
      </MenuItem>
    );
  }, [navigate]);

  return (
    <>
      <TableNew<Part>
        count={count}
        columns={columns}
        data={data}
        label="Part"
        newPath={path.to.newPart}
        newPermission={permissions.can("create", "parts")}
        renderContextMenu={renderContextMenu}
      />
    </>
  );
});

PartsTable.displayName = "PartTable";

export default PartsTable;
