import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Checkbox,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { SyntheticEvent, useEffect, useState } from "react";
import { Column } from "react-table";

import Table from "./Table";
import { ToDoItem } from "./types/ToDoItem";

function ToDoList() {
  const [toDoItems, setToDoItems] = useState<ToDoItem[]>([]);
  const [toDoColumns, setTodoColumns] = useState<Column<ToDoItem>[]>(
    [
      {
        Header: "DONE",
        accessor: (row: ToDoItem, index: number) => (
          <Checkbox
            isChecked={row.completed}
            onChange={() => handleToggleItem(row.id, index)}
            width={100}
            px={6}
            py={4}
          />
        )
      },
      {
        Header: "DESCRIPTION",
        accessor: "description",
      },
      {
        Header: " ",
        accessor: (row: ToDoItem, index: number) => (
          <Box px={6} py={4}>
            <IconButton
              icon={<DeleteIcon />}
              aria-label="Delete this item"
              onClick={() => handleDeleteItem(row.id, index)}
              size="xs"
              background="gray.600"
              _hover={{ bg: "red.600" }}
              color="white"
            />
          </Box>
        )
      },
    ]
  );
  const [newItemDescription, setNewItemDescription] = useState<string>("");

  useEffect(() => {
    async function getItems() {
      const res = await fetch("http://localhost:3001/items");
      const data = await res.json();
      if (data) setToDoItems(data);
    }
    getItems();
  }, []);

  function handleSubmitNewItem(event: SyntheticEvent): void {
    event.preventDefault();
    async function createItem() {
      const response = await fetch("http://localhost:3001/items", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: newItemDescription }),
      });
      const data = await response.json();
      if (data) {
        setToDoItems((prev) => [...prev, data]);
        setNewItemDescription("");
      }
    }

    createItem();
  }

  function handleDeleteItem(id: number, index: number): void {
    async function deleteItem() {
      const response = await fetch(`http://localhost:3001/items/${id}`, {
        method: "DELETE",
      });
      setToDoItems((prev) => [
        ...prev.slice(0, index),
        ...prev.slice(index + 1),
      ]);
    }

    deleteItem();
  }

  function handleToggleItem(id: number, index: number): void {
    async function toggleItem() {
      const response = await fetch(`http://localhost:3001/items/${id}/toggle`, {
        method: "PUT",
      });
      setToDoItems((prev) => [
        ...prev.slice(0, index),
        { ...prev[index], completed: !prev[index].completed },
        ...prev.slice(index + 1),
      ]);
    }
    toggleItem();
  }

  return (
    <>
      <Center>
        <Box p={4} width="640px">
          <Heading>To-Do List</Heading>
        </Box>
      </Center>

      <Table<ToDoItem> columns={toDoColumns} data={toDoItems} />
    </>
  );
}

export default ToDoList;
