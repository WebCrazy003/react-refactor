import {
  Box,
  Center,
  Heading,
  Text,
  Image,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Column } from "react-table";

import { User } from "./types/User";
import Table from "./Table";

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [toDoColumns, setTodoColumns] = useState<Column<User>[]>(
    [
      {
        Header: "IMAGE",
        accessor: (row: User, index: number) => (
          <Box px={6} py={4}>
            <Image src={row.avatarUrl} />
          </Box>
        )
      },
      {
        Header: "NAME",
        accessor: "username",
      },
      {
        Header: "EMAIL",
        accessor: "email",
      },
      {
        Header: "FOLLOWERS",
        accessor: (row: User, index: number) => (
          <Box px={6} py={4}>
            <Text fontSize={16}>{row.followers.length}</Text>
          </Box>
        )
      },
    ]
  );

  useEffect(() => {
    async function getUsers() {
      const res = await fetch("http://localhost:3001/users");
      const data = await res.json();
      if (data) setUsers(data);
    }
    getUsers();
  }, []);

  return (
    <>
      <Center>
        <Box p={4} width="640px">
          <Heading>Users</Heading>
        </Box>
      </Center>

      <Table<User> columns={toDoColumns} data={users} />
    </>
  );
}

export default Users;
