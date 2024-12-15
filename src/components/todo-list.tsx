import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSavedTodos, saveTodo, Todo } from "../api";
import { cn } from "../util";
import { FaCheck, FaSpinner } from "react-icons/fa";

export const TodoList = () => {
  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: getSavedTodos,
  });

  return (
    <div className="w-[500px] h-[500px] flex flex-col items-stretch gap-2 overflow-scroll">
      {todos?.map((t) => (
        <TodoListItem key={t.id} todo={t} />
      ))}
    </div>
  );
};

export type TodoListItemProps = {
  todo: Todo;
};
export const TodoListItem = (props: TodoListItemProps) => {
  const { todo } = props;
  const queryClient = useQueryClient();
  const { mutateAsync: updateTodo, isPending: isPendingSave } = useMutation({
    mutationKey: ["saveTodo"],
    mutationFn: saveTodo,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["todos"] });
    },
  });
  const onComplete = (todo: Todo) => {
    if (todo.completed) return;
    updateTodo({ ...todo, completed: true });
  };
  return (
    <div
      onClick={() => onComplete(todo)}
      className={cn(
        "cursor-pointer p-4 bg-slate-200 flex items-center justify-between rounded-md shadow",
        todo.completed ? "bg-green-700 text-white cursor-default" : ""
      )}
    >
      <h3 className="text-slate-700">{todo.title}</h3>
      {!todo.completed && (
        <button className="p-2 bg-green-700 text-white">
          {isPendingSave ? (
            <FaSpinner size={22} className="text-slate-700 animate-spin" />
          ) : (
            "Complete"
          )}
        </button>
      )}
      {todo.completed && <FaCheck size={22} color="white" />}
    </div>
  );
};
