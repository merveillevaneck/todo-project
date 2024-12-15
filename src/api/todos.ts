import { SavedTodos, SavedTodosSchema, Todo } from "./schema";

const TODOS_KEY = "my-todos";

//in order to mock the api I decided to use localStorage as a
//kind of data source. making service functions for it then
//emulates talking to an API using tanstack query hooks

export const getSavedTodos = () => {
  const stored = localStorage.getItem(TODOS_KEY);
  if (!stored) return [];
  let stringToObject = null;
  try {
    stringToObject = JSON.parse(stored);
  } catch (e) {
    throw new Error("Internal server error");
  }
  if (!stringToObject) return [];
  const safeTodos = SavedTodosSchema.safeParse(stringToObject);

  if (!safeTodos.success) return [];
  return safeTodos.data;
};

export const saveTodos = async (todos: SavedTodos) => {
  return localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
};

export const getTodo = (id: number) => {
  const todos = getSavedTodos();
  const found = todos.find((t) => t.id === id);
  if (!found) return null;
  return found;
};

export const saveTodo = async (todo: Todo) => {
  console.log("updating", todo.title);
  const todos = getSavedTodos();
  const found = todos.find((t) => t.id === todo.id);
  if (!found) {
    console.log("no match found for todo.id", todo.id, "adding todo...");
    saveTodos([...todos, todo]);
    return todo;
  }
  const newTodos = todos.map((t) => (t.id === todo.id ? { ...t, ...todo } : t));

  saveTodos(newTodos);

  return todo;
};

//This function only completes if no existing todos are found in localstorage.
//If existing todos are found, then those are considered the most up to date
//and relevant. Thereby simulating that the state of the todo updates persisting
//across reloads of the app.
export const fetchExternal = async () => {
  const existing = getSavedTodos();

  if (existing?.length) return existing;
  console.log("no existing todos found");

  console.log("fetching external todos...");
  const result = await fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await result.json();

  const parsedExternal = SavedTodosSchema.safeParse(json);
  if (parsedExternal.success) {
    console.log("loaded external todos. saving...");
    saveTodos(parsedExternal.data);
    console.log("external todos saved!");
    return parsedExternal.data;
  }
  return null;
};
