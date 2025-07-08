import Image from "next/image";
import Dropdown from "./components/Dropdown";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        {/* Dropdown above the message */}
        <div className="flex justify-center mb-4">
          <Dropdown position="above" trigger="Dropdown Above">
            <div className="text-gray-800">
              <h3 className="font-semibold mb-2">Options Above</h3>
              <ul className="space-y-1">
                <li>
                  <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                    Option 1
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                    Option 2
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                    Option 3
                  </button>
                </li>
              </ul>
            </div>
          </Dropdown>
        </div>

        {/* Main message */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">
            This is the main message
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The dropdown boxes appear above and below this message as requested.
          </p>
        </div>

        {/* Dropdown below the message */}
        <div className="flex justify-center mt-4">
          <Dropdown position="below" trigger="Dropdown Below">
            <div className="text-gray-800">
              <h3 className="font-semibold mb-2">Options Below</h3>
              <ul className="space-y-1">
                <li>
                  <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                    Action A
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                    Action B
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                    Action C
                  </button>
                </li>
              </ul>
            </div>
          </Dropdown>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
