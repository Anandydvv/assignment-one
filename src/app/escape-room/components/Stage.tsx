"use client";
import { useState } from "react";

interface StageProps {
  stage: number;
  onNext: () => void;
}

export default function Stage({ stage, onNext }: StageProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  switch (stage) {
    // ---------------------------------------------
    // 🧩 STAGE 1: Fix the Code
    // ---------------------------------------------
    case 1:
      return (
        <div>
          <h2>Stage 1 – Fix the Code</h2>
          <p>
            The loop below has an error. Type the <b>correct version</b> in the box:
          </p>

          <pre className="bg-gray-100 p-2 rounded-md text-left inline-block">
            for (let i = 0; i &lt; 10; i+) {"{"} console.log(i) {"}"}
          </pre>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type here... e.g. for (let i = 0; i < 10; i++) { console.log(i); }'
            className="border w-full mt-3 p-2 font-mono text-sm"
            rows={3}
          />

          <button
            onClick={() => {
              const correct =
                input.trim() === "for (let i = 0; i < 10; i++) { console.log(i); }";
              if (correct) {
                setOutput("✅ Correct! Moving to next stage...");
                setTimeout(onNext, 1000);
              } else {
                setOutput("❌ Incorrect. Try again!");
              }
            }}
            className="border px-4 py-1 mt-2 bg-green-100 hover:bg-green-200"
          >
            Submit
          </button>

          <p className="mt-2">{output}</p>
        </div>
      );

    // ---------------------------------------------
    // 🧮 STAGE 2: Write a Function
    // ---------------------------------------------
    // 🧮 STAGE 2: Write a Function
        // 🧮 STAGE 2: Write a Function
        case 2:
        return (
            <div>
            <h2>Stage 2 – Write a Function</h2>
            <p>
                Write a JavaScript function named <code>add</code> that returns the sum of 2 numbers.
            </p>

            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Example:\nfunction add(a, b) {\n  return a + b;\n}`}
                className="border w-full mt-3 p-2 font-mono text-sm"
                rows={4}
            />

            <button
                onClick={() => {
                try {
                    // run user code in its own scope and capture the return value
                    let result;
                    const testRunner = new Function(`
                    ${input}
                    if (typeof add !== 'function') throw new Error('add not defined');
                    return add(2, 2);
                    `);

                    result = testRunner();

                    if (result === 4) {
                    setOutput("✅ Function works! Proceeding...");
                    setTimeout(onNext, 1000);
                    } else {
                    setOutput("❌ Function incorrect or returned wrong value.");
                    }
                } catch (err: any) {
                    console.error(err);
                    setOutput("❌ Syntax error or function not defined properly.");
                }
                }}
                className="border px-4 py-1 mt-2 bg-blue-100 hover:bg-blue-200"
            >
                Run Function
            </button>

            <p className="mt-2">{output}</p>

            <details className="mt-3 text-sm">
                <summary className="cursor-pointer text-blue-600">💡 Show Answer</summary>
                <pre className="bg-gray-100 p-2 rounded-md text-left inline-block mt-1">
        {`function add(a, b) {
        return a + b;
        }`}
                </pre>
            </details>
            </div>
        );


    // ---------------------------------------------
    // 🔢 STAGE 3: Generate Numbers
    // ---------------------------------------------
    case 3:
      return (
        <div>
          <h2>Stage 3 – Generate Numbers</h2>
          <p>Write code that logs all numbers from 0 to 1000.</p>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Example:\nfor (let i = 0; i <= 1000; i++) {\n  console.log(i);\n}`}
            className="border w-full mt-3 p-2 font-mono text-sm"
            rows={4}
          />

          <button
            onClick={() => {
              try {
                // eslint-disable-next-line no-eval
                eval(input);
                setOutput("✅ Numbers generated! You escaped!");
                setTimeout(onNext, 1500);
              } catch (err) {
                setOutput("❌ Code error. Try again!");
              }
            }}
            className="border px-4 py-1 mt-2 bg-yellow-100 hover:bg-yellow-200"
          >
            Run Code
          </button>

          <p className="mt-2">{output}</p>

          <details className="mt-3 text-sm">
            <summary className="cursor-pointer text-blue-600">
              💡 Show Answer
            </summary>
            <pre className="bg-gray-100 p-2 rounded-md text-left inline-block mt-1">
{`for (let i = 0; i <= 1000; i++) {
  console.log(i);
}`}
            </pre>
          </details>
        </div>
      );

    // ---------------------------------------------
    // 🎉 FINAL MESSAGE
    // ---------------------------------------------
    default:
      return (
        <div>
          <h2 className="text-green-600 text-2xl">🎉 You Escaped the Room!</h2>
          <p>All coding challenges completed successfully.</p>
        </div>
      );
  }
}
