'use client'

export default function MainContentShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 min-h-0 flex flex-col w-full md:w-[calc(100vw-26rem)] items-start overflow-y-hidden overflow-x-hidden focus:outline-hidden">
      <div
        className="flex min-h-0 w-full flex-1 overflow-y-hidden overflow-x-hidden focus:outline-hidden"
      >
        {children}
      </div>
    </main>
  );
}
