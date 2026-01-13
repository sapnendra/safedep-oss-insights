import Link from "next/link";

const examplePackages = [
  { ecosystem: "npm", name: "next", version: "15.5.4", label: "Next" },
  { ecosystem: "npm", name: "express", version: "4.21.2", label: "Express" },
  { ecosystem: "npm", name: "axios", version: "1.7.2", label: "Axios" },
  { ecosystem: "npm", name: "lodash", version: "4.17.21", label: "Lodash" },
  {
    ecosystem: "pypi",
    name: "requests",
    version: "2.31.0",
    label: "Requests (Python)",
  },
  {
    ecosystem: "npm",
    name: "react-router-dom",
    version: "6.15.0",
    label: "React Router DOM",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-600">SafeDep Insights</h1>
          <p className="text-gray-500">
            Analyze open source packages for security, licenses, and more
          </p>
        </div>

        {/* URL Pattern */}
        <div className="flex items-center flex-col justify-center bg-white border border-gray-200 rounded-lg py-4 px-5">
          <p className="text-sm text-gray-500 mb-2">URL Pattern:</p>
          <code className="text-xs sm:text-sm bg-gray-100 px-3 py-1.5 rounded font-mono text-gray-700">
            /p/{"{ecosystem}"}/{"{name}"}/{"{version}"}
          </code>
        </div>

        {/* Example Packages */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Try these packages:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {examplePackages.map((pkg) => (
              <Link
                key={`${pkg.ecosystem}-${pkg.name}-${pkg.version}`}
                href={`/p/${pkg.ecosystem}/${encodeURIComponent(pkg.name)}/${
                  pkg.version
                }`}
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-emerald-500 hover:shadow-md transition-all text-left"
              >
                <span className="text-emerald-600 font-medium">
                  {pkg.label}
                </span>
                <span className="block text-xs text-gray-400 mt-1 font-mono">
                  {pkg.name}@{pkg.version}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 pt-8">
          Powered by{" "}
          <a
            href="https://safedep.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline"
          >
            SafeDep
          </a>
        </p>
      </div>
    </div>
  );
}
