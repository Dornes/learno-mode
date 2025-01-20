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
  test_code: string;
}

function PythonCodeRunner({ solution, test_code }: PythonCodeRunnerProps) {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState<string>(solution);
  const [printOutput, setPrintOutput] = useState<string | null>(null);
  const [testCode, setTestCode] = useState<string>(solution + "\n" + test_code);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [evaluationDisabled, setEvaluationDisabled] = useState<boolean>(true);

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
    setEvaluationDisabled(true);
    if (isTesting) {
      if (printOutput === "All test cases passed!") {
        setEvaluationDisabled(false);
      }
    }
  }, [isTesting, printOutput]);

  const printHandler = (text: string) => {
    setPrintOutput((prev) => (prev ? prev + "\n" + text : text));
  };

  const runCode = (input: string) => {
    setPrintOutput("");
    setIsTesting(false);
    if (pyodide) {
      const output = pyodide.runPython(input);
      setOutput(output);
    }
  };

  const handleChange = (input: string) => {
    setCodeInput(input);
    setTestCode(input + "\n" + test_code);
  };

  const handleTestClick = (input: string) => {
    runCode(input);
    setIsTesting(true);
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
            value={codeInput}
            onChange={(e) => handleChange(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <div className="flex flex-row w-full">
            {pyodide ? (
              <Button onClick={() => runCode(codeInput)}>Run Code</Button>
            ) : (
              <LoaderButton />
            )}
            <div className="ml-auto space-x-2">
              <Button
                name="action"
                value="test"
                onClick={() => handleTestClick(testCode)}
              >
                Test
              </Button>
              <Button name="action" value="code" disabled={evaluationDisabled}>
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
