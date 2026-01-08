import Image from "next/image";

export default function Home() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-1/2 flex flex-col gap-10 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <img
        className="h-10"
        src="https://mintcdn.com/safedep/SBr4leJ2Q_jWmTGH/images/full-logo-for-light-theme.png?fit=max&auto=format&n=SBr4leJ2Q_jWmTGH&q=85&s=c5133b0c57a88228719710fb4c94ff90"
        alt="safedep logo"
      />
      <h1 className="text-[2vw] font-bold text-gray-400">
        Welcome to SafeDep Insights
      </h1>
    </div>
  );
}
