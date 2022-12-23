import { ActionMenu } from "@carbon/react";
import {
  Avatar,
  AvatarGroup,
  Flex,
  MenuItem,
  VisuallyHidden,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { memo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components/Data";
import { usePermissions } from "~/hooks";
import type { Group } from "~/modules/Users/types";

type GroupsTableProps = {
  data: Group[];
  count: number;
};

const GroupsTable = memo(({ data, count }: GroupsTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const rows = data.map((row) => ({
    id: row.data.id,
    name: row.data.name,
    isEmployeeTypeGroup: row.data.isEmployeeTypeGroup,
    members: row.data.users
      .map((user) => `${user.firstName} ${user.lastName}`)
      .concat(row.children.map((child) => child.data.name)),
  }));

  return (
    <Table<typeof rows[number]>
      data={rows}
      count={count}
      columns={[
        {
          accessorKey: "name",
          header: "Group Name",
          cell: (item) => item.getValue(),
        },
        {
          header: "Members",
          // accessorKey: undefined, // makes the column unsortable
          cell: ({ row }) => (
            <AvatarGroup max={5} size="sm" spacing={-2}>
              {row.original.members.map((name: string, index: number) => (
                <Avatar
                  key={index}
                  name={name}
                  title={name}
                  colorScheme="gray"
                />
              ))}
            </AvatarGroup>
          ),
        },
        {
          accessorKey: "id",
          header: () => <VisuallyHidden>Actions</VisuallyHidden>,
          cell: ({ row }) => (
            <Flex justifyContent="end">
              <ActionMenu>
                <MenuItem
                  isDisabled={
                    row.original.isEmployeeTypeGroup ||
                    !permissions.can("update", "users")
                  }
                  icon={<BsPencilSquare />}
                  onClick={() => {
                    navigate(`/app/users/groups/${row.original.id}`);
                  }}
                >
                  Edit Group
                </MenuItem>
                <MenuItem
                  isDisabled={
                    row.original.isEmployeeTypeGroup ||
                    !permissions.can("delete", "users")
                  }
                  icon={<IoMdTrash />}
                  onClick={() => {
                    navigate(`/app/users/groups/delete/${row.original.id}`);
                  }}
                >
                  Delete Group
                </MenuItem>
              </ActionMenu>
            </Flex>
          ),
        },
      ]}
    />
  );
});

GroupsTable.displayName = "GroupsTable";
export default GroupsTable;