'use client'

import { useToggleStore } from "@/app/lib/zustand/useToggleStore";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEventHandler } from "react";

const menuColumns = [
  [
    { href: "/", name: "타임라인" },
    { href: "graph", name: "그래프" },
  ],
  [
    { href: "work", name: "진열대" },
    { href: "shop", name: "가판대" },
  ],
  [
    { href: "photobook", name: "사진집" },
    { href: "map", name: "세계지도" },
  ],
];

function getRootPath(pathname: string) {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return firstSegment ?? "";
}

function getNormalizedHref(href: string) {
  return href === "/" ? "" : href;
}

function getMenuHref(href: string) {
  return href === "/" ? "/" : `/${href}`;
}

export default function Menus() {
  const pathname = usePathname();
  const rootPath = getRootPath(pathname);

  const initializeToggles = useToggleStore((s) => s.initializeToggles);
  const isEnabled = useToggleStore((s) => s.toggles["noteInspector"]);

  const [openMode, setOpenMode] = useState<"hover" | "pinned" | null>(null);
  const [sizes, setSizes] = useState({
    collapsed: { width: 0, height: 0 },
    expanded: { width: 0, height: 0 },
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const collapsedMeasureRef = useRef<HTMLDivElement>(null);
  const expandedMeasureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeToggles();
  }, [initializeToggles]);

  const activeColumnIndex = useMemo(() => {
    const foundIndex = menuColumns.findIndex((column) =>
      column.some((menu) => getNormalizedHref(menu.href) === rootPath)
    );

    return foundIndex === -1 ? 0 : foundIndex;
  }, [rootPath]);

  const hasMatchedMenu = useMemo(() => {
    return menuColumns.some((column) =>
      column.some((menu) => getNormalizedHref(menu.href) === rootPath)
    );
  }, [rootPath]);

  const activeColumn = menuColumns[activeColumnIndex];
  const isExpanded = openMode !== null;

  useLayoutEffect(() => {
    const updateSizes = () => {
      setSizes({
        collapsed: {
          width: collapsedMeasureRef.current?.scrollWidth ?? 0,
          height: collapsedMeasureRef.current?.scrollHeight ?? 0,
        },
        expanded: {
          width: expandedMeasureRef.current?.scrollWidth ?? 0,
          height: expandedMeasureRef.current?.scrollHeight ?? 0,
        },
      });
    };

    updateSizes();

    window.addEventListener("resize", updateSizes);
    return () => {
      window.removeEventListener("resize", updateSizes);
    };
  }, [activeColumnIndex]);

  useEffect(() => {
    if (openMode !== "pinned") return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenMode(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [openMode]);

  const targetSize = isExpanded ? sizes.expanded : sizes.collapsed;

  return (
    <>
      <div
        ref={containerRef}
        className={clsx(
          isEnabled ? "md:left-72" : "md:left-30",
          "absolute left-14 top-1 block",
          "text-sm text-text-900 transition-[left] duration-200 ease-[cubic-bezier(0.75,0.05,0.45,0.95)]"
        )}
        onClick={() => {
          setOpenMode((prev) => (prev === "pinned" ? null : "pinned"));
        }}
      >
        <div
          className="relative rounded-sm transition-[width,height] duration-300 ease-[cubic-bezier(0.75,0.05,0.45,0.95)]"
          style={{
            width: targetSize.width || undefined,
            height: targetSize.height || undefined,
          }}
        >
          {isExpanded && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 top-1 z-0 rounded-sm bg-button-200/25 backdrop-blur-md" />
          )}

          <div className="relative z-10 px-2">
            {isExpanded ? (
              <ExpandedMenus
                rootPath={rootPath}
                onClose={() => {
                  if (openMode === "hover") setOpenMode(null);
                }}
              />
            ) : (
              <CollapsedMenus
                activeColumn={activeColumn}
                hasMatchedMenu={hasMatchedMenu}
                rootPath={rootPath}
                onOpen={() => {
                  if (openMode !== "pinned") setOpenMode("hover");
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed left-0 top-0 -z-10 opacity-0">
        <div ref={collapsedMeasureRef} className="px-2">
          <CollapsedMenus
            activeColumn={activeColumn}
            hasMatchedMenu={hasMatchedMenu}
            rootPath={rootPath}
            onOpen={() => {}}
          />
        </div>
        <div ref={expandedMeasureRef} className="px-2">
          <ExpandedMenus rootPath={rootPath} onClose={() => {}} />
        </div>
      </div>
    </>
  );
}

function CollapsedMenus({
  activeColumn,
  hasMatchedMenu,
  rootPath,
  onOpen,
}: {
  activeColumn: { href: string; name: string }[];
  hasMatchedMenu: boolean;
  rootPath: string;
  onOpen: () => void;
}) {
  return (
    <div className="flex items-start gap-3 py-1 text-nowrap">
      <div
        className="flex h-10 shrink-0 items-start px-2 pt-2"
        onMouseEnter={onOpen}
      >
        <span className="cursor-default text-sm md:text-xs">solmi.wiki</span>
      </div>
      <div className={clsx(!hasMatchedMenu && "hidden")}>
        <div
          className="flex flex-col gap-1 rounded-sm bg-button-100 p-1"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div className="flex items-center gap-1 text-sm md:text-xs">
            {activeColumn.map((menu) => (
              <MenuLink
                key={menu.href}
                href={menu.href}
                name={menu.name}
                rootPath={rootPath}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpandedMenus({
  rootPath,
  onClose,
}: {
  rootPath: string;
  onClose: () => void;
}) {
  return (
    <div
      className="flex flex-col items-start gap-3 py-1 text-nowrap md:flex-row md:gap-4"
      onMouseLeave={onClose}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <span className="shrink-0 px-2 pt-2 text-sm md:text-xs">solmi.wiki</span>
      <div className="flex flex-col gap-2 py-1">
        {menuColumns.map((column, index) => (
          <div key={index} className="flex items-center gap-1 text-sm md:text-xs">
            {column.map((menu) => (
              <MenuLink
                key={menu.href}
                href={menu.href}
                name={menu.name}
                rootPath={rootPath}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuLink({
  href,
  name,
  rootPath,
  onClick,
}: {
  href: string;
  name: string;
  rootPath: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  const normalizedHref = getNormalizedHref(href);

  return (
    <Link
      href={getMenuHref(href)}
      onClick={onClick}
      className={clsx(
        "flex h-7 items-center rounded-sm px-2 transition-colors duration-200 hover:bg-background/50",
        rootPath === normalizedHref ? "bg-background" : "bg-transparent"
      )}
    >
      {name}
    </Link>
  );
}
