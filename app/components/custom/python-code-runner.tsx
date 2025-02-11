import { loadPyodide, PyodideInterface } from "pyodide";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Form } from "@remix-run/react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";

interface PythonCodeRunnerProps {
  solution: string;
  test_code: string;
}

function PythonCodeRunner({ solution, test_code }: PythonCodeRunnerProps) {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState<string>(solution);
  const [printOutput, setPrintOutput] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [evaluationAllowed, setEvaluationAllowed] = useState<boolean>(false);
  const isClient = typeof window !== "undefined";

  //Loads Pyodide when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.2/full",
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
    setEvaluationAllowed(false);
    if (isTesting) {
      if (printOutput === "All test cases passed!") {
        setEvaluationAllowed(true);
      }
    }
  }, [isTesting, printOutput]);

  const printHandler = (text: string) => {
    setPrintOutput((prev) => (prev ? prev + "\n" + text : text));
  };

  const runCode = (codeInput: string) => {
    setPrintOutput("");
    setOutput(pyodide!.runPython(codeInput));
  };

  const handleRunClick = (codeInput: string) => {
    setIsTesting(false);
    runCode(codeInput);
  };

  const handleTestClick = (codeInput: string) => {
    setIsTesting(true);
    setOutput("");
    runCode(codeInput + "\n\n" + test_code);
  };

  const LoaderButton = () => {
    return (
      <Button disabled>
        <Loader2 className="animate-spin" />
        Loading...
      </Button>
    );
  };

  return (
    <Form method="POST">
      <Card className="w-3/4 border-none shadow-none">
        <CardContent className="mt-5 p-0">
          {isClient && (
            <Editor
              highlight={(code) =>
                Prism.highlight(code, Prism.languages.python, "python")
              }
              onValueChange={(code) => setCodeInput(code)}
              value={codeInput}
              name="code"
              padding={10}
              className="h-80 bg-gray-100 rounded-md"
            />
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 p-0 mt-2">
          <div className="flex flex-row w-full">
            {pyodide ? (
              <Button
                name="action"
                value="save"
                onClick={() => handleRunClick(codeInput)}
              >
                Run Code
              </Button>
            ) : (
              <LoaderButton />
            )}
            <div className="ml-auto space-x-2">
              <Button
                name="action"
                value="save"
                disabled={!pyodide}
                onClick={() => handleTestClick(codeInput)}
              >
                Test
              </Button>
              <Button
                name="action"
                value="evaluate"
                // disabled={!evaluationAllowed}
              >
                Evaluate
              </Button>
            </div>
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
