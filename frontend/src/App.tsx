import { useEffect } from "react";
import { testApi } from "./api/test";

export default function App() {
  useEffect(() => {
    testApi();
  }, []);

  return (
    <h1 className="text-3xl font-bold text-center text-green-500 mt-10">
      Frontend povezan sa backendom
    </h1>
  );
}