'use client'

import clsx from "clsx";
import { useToggleStore } from "@/app/lib/zustand/useToggleStore";

export default function InspectorAwareInset({
  children,
  className,
  openClassName = "",
  closedClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  openClassName?: string;
  closedClassName?: string;
}) {
  const isInspectorOpen = useToggleStore((s) => s.toggles["noteInspector"]);

  return (
    <div
      className={clsx(
        className,
        isInspectorOpen ? openClassName : closedClassName,
      )}
    >
      {children}
    </div>
  );
}
