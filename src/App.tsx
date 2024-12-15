import { useQuery } from "@tanstack/react-query";
import "./App.css";
import { fetchExternal } from "./api";
import { FaSpinner } from "react-icons/fa";
import { TodoList } from "./components/todo-list";

function App() {
  //since we are mocking an API, this fetch only happens once
  const { isPending } = useQuery({
    queryKey: ["todo-sync"],
    queryFn: fetchExternal,
  });

  if (isPending)
    return (
      <div className="flex-1 flex justify-center items-center h-screen w-screen bg-slate-900">
        <FaSpinner color="white" size={34} />
      </div>
    );
  return (
    <div className="flex-1 flex flex-col justify-center items-center h-screen w-screen bg-slate-900">
      <h1 className="text-slate-200">Task list</h1>
      <TodoList />
    </div>
  );
}

export default App;
