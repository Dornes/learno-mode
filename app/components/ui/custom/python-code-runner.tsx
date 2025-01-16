import { loadPyodide, PyodideInterface } from "pyodide";
import { useEffect, useState } from "react";
import { Textarea } from "../textarea";
import { Button } from "../button";

function PythonCodeRunner() {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState<string>("");
  const [printOutput, setPrintOutput] = useState<string | null>(null);

  //   useEffect(() => {
  //     if (typeof window !== "undefined") {
  //       loadPyodide({
  //         indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.1/full",
  //         stderr: (text) => console.log(text),
  //         stdout: (text) => console.log(text),
  //       })
  //         .then((result) => {
  //           setPyodide(result);
  //           result.runPython("print(2+2)");
  //         })
  //         .catch((error) => {
  //           console.error("Error loading Pyodide:", error);
  //         });
  //     }
  //   }, []);

  const runCode = async () => {
    if (typeof window !== "undefined") {
      loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.1/full",
        stderr: (text) => setPrintOutput(text),
        stdout: (text) => setPrintOutput(text),
      })
        .then((result) => {
          setPyodide(result);
          const output = result.runPython(codeInput);
          setOutput(output);
          console.log(output);
          console.log(printOutput);
        })
        .catch((error) => {
          console.error("Error loading Pyodide:", error);
        });
    }
  };

  return (
    <div>
      Pyodide Loaded: {pyodide ? "Yes" : "No"}
      <Textarea
        placeholder="Enter Python code here"
        value={codeInput}
        onChange={(e) => setCodeInput(e.target.value)}
      />
      <Button onClick={() => runCode()}>Run Code</Button>
      {output !== null && (
        <div>
          <h2>Output:</h2>
          <pre>{output}</pre>
          <pre>{printOutput}</pre>
        </div>
      )}
    </div>
  );
}

export default PythonCodeRunner;
