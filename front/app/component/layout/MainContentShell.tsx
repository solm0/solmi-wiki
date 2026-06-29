'use client'

export default function MainContentShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 min-w-0 min-h-0 flex flex-col w-full items-start overflow-y-hidden overflow-x-hidden focus:outline-hidden">
      <div
        className="flex min-h-0 w-full flex-1 overflow-y-hidden overflow-x-hidden focus:outline-hidden"
      >
        {children}
      </div>
    </main>
  );
}
