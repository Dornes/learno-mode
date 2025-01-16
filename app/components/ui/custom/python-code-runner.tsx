import { loadPyodide, PyodideInterface } from "pyodide";
import { useEffect, useState } from "react";

function PythonCodeRunner() {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.1/full",
        stderr: (text) => console.log(text),
        stdout: (text) => console.log(text),
      })
        .then((result) => {
          setPyodide(result);
          result.runPython("print(2+2)");
        })
        .catch((error) => {
          console.error("Error loading Pyodide:", error);
        });
    }
  }, []);

  return <div>Pyodide Loaded: {pyodide ? "Yes" : "No"}</div>;
}

export default PythonCodeRunner;
