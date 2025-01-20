import { loadPyodide, PyodideInterface } from "pyodide";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form } from "@remix-run/react";

interface PythonCodeRunnerProps {
  solution: string;
}

function PythonCodeRunner({ solution }: PythonCodeRunnerProps) {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState<string>(solution);
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
    <Form method="POST">
      <Card className="mx-auto w-1/2">
        <CardHeader>
          <CardTitle>Python Code Runner</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="code"
            className="h-80"
            placeholder="Enter Python code here"
            defaultValue={solution}
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <div className="flex flex-row w-full">
            {pyodide ? (
              <Button className="w-36" onClick={() => runCode()}>
                Run Code
              </Button>
            ) : (
              <LoaderButton />
            )}
            <Button name="action" value="code" className="ml-auto">
              Evaluate
            </Button>
          </div>
          <div className="bg-gray-100 p-4 rounded-md w-full overflow-x-auto">
            <pre>
              {output}
              {printOutput}
            </pre>
          </div>
        </CardFooter>
      </Card>
    </Form>
  );
}

export default PythonCodeRunner;
