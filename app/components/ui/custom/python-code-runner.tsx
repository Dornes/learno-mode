import { loadPyodide, PyodideInterface } from "pyodide";
import { useEffect, useState } from "react";
import { Textarea } from "../textarea";
import { Button } from "../button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card";

function PythonCodeRunner() {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState<string>("");
  const [printOutput, setPrintOutput] = useState<string | null>(null);

  //Loads Pyodide when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.1/full",
        stderr: (text) => console.log(text),
        stdout: (text) => printHandler(text),
      })
        .then((result) => {
          setPyodide(result);
        })
        .catch((error) => {
          console.error("Error loading Pyodide:", error);
        });
    }
  }, []);

  const printHandler = (text: string) => {
    setPrintOutput((prev) => (prev ? prev + "\n" + text : text));
  };

  const runCode = () => {
    setPrintOutput("");
    if (pyodide) {
      const output = pyodide.runPython(codeInput);
      setOutput(output);
    }
  };

  const LoaderButton = () => {
    return (
      <Button disabled className="w-36">
        <Loader2 className="animate-spin" />
        Loading...
      </Button>
    );
  };

  return (
    <Card className="mx-auto w-1/2">
      <CardHeader>
        <CardTitle>Python Code Runner</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          className="h-80"
          placeholder="Enter Python code here"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        {pyodide ? (
          <Button className="w-36" onClick={() => runCode()}>
            Run Code
          </Button>
        ) : (
          <LoaderButton />
        )}
        <div className="bg-gray-100 p-4 rounded-md w-full overflow-x-auto">
          <pre>
            {output}
            {printOutput}
          </pre>
        </div>
      </CardFooter>
    </Card>
  );
}

export default PythonCodeRunner;
