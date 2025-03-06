import { loadPyodide, PyodideInterface } from "pyodide";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      if (printOutput!.includes("All test cases passed!")) {
        setEvaluationAllowed(true);
      }
    }
  }, [isTesting, printOutput]);

  //Update code editor when swapping tasks
  useEffect(() => {
    setCodeInput(solution);
  }, [solution]);

  const printHandler = (text: string) => {
    setPrintOutput((prev) => (prev ? prev + "\n" + text : text));
  };

  const runCode = (codeInput: string) => {
    setPrintOutput("");
    try {
      setOutput(pyodide!.runPython(codeInput));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setOutput(errorMessage);
    }
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
      <div className="w-3/4 border-none shadow-none">
        <div className="mt-5 p-0">
          {isClient && (
            <div className="max-h-[400px] overflow-auto">
              <Editor
                highlight={(code) =>
                  Prism.highlight(code, Prism.languages.python, "python")
                }
                onValueChange={(code) => setCodeInput(code)}
                value={codeInput}
                name="code"
                padding={10}
                className="bg-gray-100 min-h-[400px] rounded-md"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col items-start gap-4 p-0 mt-2">
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
          <div className="bg-gray-100 p-4 rounded-md w-full">
            <pre className="max-h-36 overflow-auto">
              {output}
              <br />
              {printOutput}
            </pre>
          </div>
        </div>
      </div>
    </Form>
  );
}

export default PythonCodeRunner;
