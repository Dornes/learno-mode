import { loadPyodide, PyodideInterface } from "pyodide";

export var Pyodide = (function () {
    var instance: PythonRunner | null;
    function createInstance() {
        var object = new PythonRunner();
        return object;
    }
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
    };
})();

class PythonRunner {
    private _output: (text: string) => void;
    private _pyodide: PyodideInterface | null;
    constructor() {
        this._output = console.log;
        this._pyodide = null;
        loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/",
            stderr: (text) => {
                this._output(text);
            },
            stdout: (text) => {
                this._output(text);
            },
        }).then((result) => {
            this._pyodide = result;

            console.log(
                this._pyodide.runPython(`
            import sys
            sys.version
        `)
            );

            this._pyodide.runPython('print("Hello from Python!")');
        });
    }
    setOutput(output: (text: string) => void): void {
        this._output = output;
    }
    run(code: string): any {
        if (this._pyodide) {
            return this._pyodide.runPython(code);
        }
    }
}
