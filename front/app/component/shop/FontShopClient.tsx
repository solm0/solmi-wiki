"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Download, ScrollText, X } from "lucide-react";
import type { ShopFont } from "@/app/lib/data/shop-fonts";

type FontState = {
  size: number;
  axes: Record<string, number>;
  text: string;
};

function buildInitialState(fonts: ShopFont[]) {
  return fonts.reduce<Record<string, FontState>>((acc, font) => {
    acc[font.id] = {
      size: font.defaultSize,
      axes: Object.fromEntries(
        font.axes.map((axis) => [axis.key, axis.defaultValue]),
      ),
      text: font.sampleText,
    };
    return acc;
  }, {});
}

function makeVariationSettings(axes: Record<string, number>) {
  const entries = Object.entries(axes);

  if (!entries.length) return undefined;

  return entries.map(([key, value]) => `"${key}" ${value}`).join(", ");
}

function getPreviewLineCount(defaultSize: number, currentSize: number) {
  if (currentSize <= defaultSize / 2.5) return 3;
  if (currentSize <= defaultSize / 2) return 2;
  return 1;
}

export default function FontShopClient({ fonts }: { fonts: ShopFont[] }) {
  const [fontStates, setFontStates] = useState<Record<string, FontState>>(
    () => buildInitialState(fonts),
  );
  const [loadedFontIds, setLoadedFontIds] = useState<Record<string, boolean>>(
    {},
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendState, setSendState] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const panelTouchStartY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [panelFrame, setPanelFrame] = useState({ left: 0, width: 0 });

  const selectedCount = selectedIds.length;

  const selectedFileNames = useMemo(
    () =>
      fonts
        .filter((font) => selectedIds.includes(font.id))
        .map((font) => font.fileName),
    [fonts, selectedIds],
  );
  const selectedFontNames = useMemo(
    () =>
      fonts
        .filter((font) => selectedIds.includes(font.id))
        .map((font) => font.name)
        .join(", "),
    [fonts, selectedIds],
  );
  const fontFaceCss = useMemo(
    () =>
      fonts
        .map(
          (font) => `
@font-face {
  font-family: "shop-font-${font.id}";
  src: url("/fonts/shop/${font.fileName}") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
`,
        )
        .join("\n"),
    [fonts],
  );

  useEffect(() => {
    if (!editingId) return;

    const textarea = textareaRefs.current[editingId];
    if (!textarea) return;

    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  }, [editingId]);

  useEffect(() => {
    let cancelled = false;

    const loadFonts = async () => {
      await Promise.all(
        fonts.map(async (font) => {
          try {
            await document.fonts.load(
              `${font.defaultSize}px "shop-font-${font.id}"`,
              font.sampleText,
            );

            if (cancelled) return;

            setLoadedFontIds((prev) => ({
              ...prev,
              [font.id]: true,
            }));
          } catch {
            if (cancelled) return;

            setLoadedFontIds((prev) => ({
              ...prev,
              [font.id]: true,
            }));
          }
        }),
      );
    };

    loadFonts();

    return () => {
      cancelled = true;
    };
  }, [fonts]);

  useEffect(() => {
    if (!selectedCount) {
      setIsPanelOpen(false);
    }
  }, [selectedCount]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updatePanelFrame = () => {
      if (window.innerWidth < 768) {
        setPanelFrame({
          left: 0,
          width: window.innerWidth,
        });
        return;
      }

      const rect = element.getBoundingClientRect();
      setPanelFrame({
        left: rect.left,
        width: rect.width,
      });
    };

    updatePanelFrame();

    const resizeObserver = new ResizeObserver(() => {
      updatePanelFrame();
    });

    resizeObserver.observe(element);
    window.addEventListener("resize", updatePanelFrame);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePanelFrame);
    };
  }, []);

  const updateSize = (fontId: string, size: number) => {
    setFontStates((prev) => ({
      ...prev,
      [fontId]: {
        ...prev[fontId],
        size,
      },
    }));
  };

  const updateAxis = (fontId: string, key: string, value: number) => {
    setFontStates((prev) => ({
      ...prev,
      [fontId]: {
        ...prev[fontId],
        axes: {
          ...prev[fontId].axes,
          [key]: value,
        },
      },
    }));
  };

  const updateText = (fontId: string, text: string) => {
    setFontStates((prev) => ({
      ...prev,
      [fontId]: {
        ...prev[fontId],
        text,
      },
    }));
  };

  const toggleSelected = (fontId: string) => {
    setSelectedIds((prev) =>
      prev.includes(fontId)
        ? prev.filter((id) => id !== fontId)
        : [...prev, fontId],
    );
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  const sendSelectedFonts = async () => {
    if (!selectedFileNames.length) return;
    if (!customerName.trim() || !customerEmail.trim()) return;

    setIsSending(true);
    setSendState({
      type: "idle",
      message: "",
    });

    try {
      const response = await fetch("/api/fonts/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: customerName,
          email: customerEmail,
          fileNames: selectedFileNames,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(data?.message ?? "메일 전송에 실패했습니다.");
      }

      setSendState({
        type: "success",
        message: "메일 전송 완료",
      });
      setCustomerName("");
      setCustomerEmail("");
    } catch (error) {
      setSendState({
        type: "error",
        message: error instanceof Error ? error.message : "메일 전송에 실패했습니다.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <style>{fontFaceCss}</style>
      <style>{`
        .shop-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 10rem;
          min-width: 10rem;
          background: transparent;
        }

        .shop-slider::-webkit-slider-runnable-track {
          height: 1px;
          background: var(--color-stone-900);
          border-radius: 9999px;
        }

        .shop-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background: var(--color-stone-900);
          margin-top: -5.5px;
          border: 0;
        }

        .shop-slider::-moz-range-track {
          height: 1px;
          background: var(--color-stone-900);
          border-radius: 9999px;
        }

        .shop-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background: var(--color-stone-900);
          border: 0;
        }

        .shop-slider::-moz-range-progress {
          height: 1px;
          background: var(--color-stone-900);
        }

        .shop-slider::-ms-track {
          height: 1px;
          background: transparent;
          border-color: transparent;
          color: transparent;
        }

        .shop-slider::-ms-fill-lower,
        .shop-slider::-ms-fill-upper {
          background: var(--color-stone-900);
        }

        .shop-slider::-ms-thumb {
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background: var(--color-stone-900);
          border: 0;
        }

        .shop-preview::selection,
        .shop-preview *::selection {
          background: var(--color-button-200);
          color: var(--color-stone-800)
        }
      `}</style>
      <div ref={containerRef} className="flex flex-col gap-4 w-full pb-72">
        {fonts.map((font) => {
          const fontState = fontStates[font.id];
          const isFontLoaded = loadedFontIds[font.id];
          const expanded = hoveredId === font.id || editingId === font.id;
          const variationSettings = makeVariationSettings(fontState.axes);
          const isSelected = selectedIds.includes(font.id);
          const previewLineCount = getPreviewLineCount(
            font.defaultSize,
            fontState.size,
          );

          return (
            <div
              id={font.id}
              key={font.id}
              className="w-full bg-button-100 rounded-3xl text-text-800 transition-all duration-300"
              onMouseEnter={() => setHoveredId(font.id)}
              onMouseLeave={() => setHoveredId((current) => current === font.id ? null : current)}
              onFocus={() => setHoveredId(font.id)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setHoveredId((current) => current === font.id ? null : current);
                }
              }}
            >
              <div className="p-7 pb-0 flex flex-col gap-4 transition-all duration-300">
                <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between">
                  <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-start md:gap-6">
                    <div className="flex w-full items-center justify-between gap-4 md:w-auto">
                      <div className="flex gap-3 items-center text-stone-900 w-32">
                        <span className="shrink-0 md:block text-sm">{font.name}</span>
                        <Link href={font.detailHref} className="flex items-center gap-1">
                          <ScrollText size={14} className="hover:opacity-50 transition-opacity" />
                        </Link>
                      </div>
                      <div
                        className={`flex shrink-0 items-start gap-4 transition-opacity duration-300 opacity-100 md:opacity-0 md:pointer-events-none`}
                      >
                        <label className="flex items-center">
                          <button
                            className="w-5 h-5 border-2 border-text-700 hover:border-text-800 transition-colors duration-300 rounded-sm overflow-hidden"
                            onClick={() => toggleSelected(font.id)}
                          >
                            <div className={`w-full h-full ${isSelected ? 'bg-green-500' : 'bg-transparent'} transition-colors duration-300`} />
                          </button>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelected(font.id)}
                            className="accent-stone-900 hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-center justify-between gap-4 w-70">
                        <div className="flex items-center gap-2 text-[11px] text-stone-900">
                          <span>size</span>
                          <span>{fontState.size}</span>
                        </div>
                        <input
                          type="range"
                          min={font.size.min}
                          max={font.size.max}
                          step={font.size.step}
                          value={fontState.size}
                          onChange={(event) =>
                            updateSize(font.id, Number(event.target.value))
                          }
                          className="shop-slider shrink-0"
                        />
                      </div>
                      {font.axes.map((axis) => (
                        <div
                          key={axis.key}
                          className={`flex items-center justify-between gap-4 w-70 transition-all duration-300 ${
                            expanded
                              ? "md:max-h-12 md:opacity-100"
                              : "md:max-h-0 md:opacity-0 md:pointer-events-none"
                          }`}
                        >
                          <div className="flex items-center gap-2 text-[11px] text-stone-900">
                            <span>{axis.label}</span>
                            <span>{fontState.axes[axis.key]}</span>
                          </div>
                          <input
                            type="range"
                            min={axis.min}
                            max={axis.max}
                            step={axis.step}
                            value={fontState.axes[axis.key]}
                            onChange={(event) =>
                              updateAxis(font.id, axis.key, Number(event.target.value))
                            }
                            className="shop-slider shrink-0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`hidden md:flex shrink-0 items-start gap-4 transition-opacity duration-300`}
                  >
                    <label className="flex items-center">
                      <button
                        className="w-5 h-5 border-2 border-text-700 hover:border-text-800 transition-colors duration-300 rounded-sm overflow-hidden"
                        onClick={() => toggleSelected(font.id)}
                      >
                        <div className={`w-full h-full ${isSelected ? 'bg-green-500' : 'bg-transparent'} transition-colors duration-300`} />
                      </button>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelected(font.id)}
                        className="accent-stone-900 hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div
                className="pl-7 pr-0 pb-7 pt-4"
                style={{
                  minHeight: "1.2em",
                }}
              >
                {!isFontLoaded ? (
                  <div className="w-full h-full min-h-[1.2em] flex items-center justify-center text-sm text-stone-700">
                    loading
                  </div>
                ) : editingId === font.id ? (
                  <textarea
                    ref={(node) => {
                      textareaRefs.current[font.id] = node;
                    }}
                    value={fontState.text}
                    onChange={(event) => updateText(font.id, event.target.value)}
                    onBlur={() => setEditingId((current) => current === font.id ? null : current)}
                    rows={1}
                    className="shop-preview w-full resize-none overflow-hidden whitespace-nowrap bg-transparent focus:outline-hidden text-stone-800"
                    style={{
                      fontFamily: `shop-font-${font.id}`,
                      fontSize: `${fontState.size}px`,
                      lineHeight: 1.2,
                      height: "1.2em",
                      fontVariationSettings: variationSettings,
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingId(font.id)}
                    className="shop-preview w-full overflow-hidden whitespace-nowrap bg-transparent text-left select-text text-stone-800"
                    style={{
                      fontFamily: `shop-font-${font.id}`,
                      fontSize: `${fontState.size}px`,
                      lineHeight: 1.2,
                      fontVariationSettings: variationSettings,
                    }}
                  >
                    {fontState.text}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedCount > 0 ? (
        <div
          className="fixed bottom-0 pointer-events-none"
          style={{
            left: `${panelFrame.left}px`,
            width: `${panelFrame.width}px`,
          }}
        >
          <div
            className={`pointer-events-auto w-full bg-green-500 rounded-t-3xl text-stone-900 overflow-hidden transition-all duration-300 origin-bottom ${
              isPanelOpen ? "max-h-56" : "max-h-16"
            } ${isPanelOpen ? "hover:translate-y-0" : "hover:translate-y-1"}`}
            onTouchStart={(event) => {
              panelTouchStartY.current = event.touches[0]?.clientY ?? null;
            }}
            onTouchEnd={(event) => {
              if (!isPanelOpen || window.innerWidth >= 768) return;
              const startY = panelTouchStartY.current;
              const endY = event.changedTouches[0]?.clientY;
              panelTouchStartY.current = null;

              if (startY == null || endY == null) return;
              if (endY - startY > 56) {
                closePanel();
              }
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (isPanelOpen) return;
                setIsPanelOpen(true);
                setSendState({
                  type: "idle",
                  message: "",
                });
              }}
              className={`w-full transition-all duration-300 ${
                isPanelOpen ? "pointer-events-none h-0 opacity-0" : "h-16 px-6"
              }`}
            >
              <div className="w-full h-full flex items-center justify-center gap-2">
                <Download size={18} />
                <span>{selectedCount}개 다운로드</span>
              </div>
            </button>

            <div
              className={`flex flex-col gap-5 px-6 pt-2 transition-all duration-300 ${
                isPanelOpen
                  ? "max-h-96 opacity-100 pb-8"
                  : "max-h-0 opacity-0 pointer-events-none p-0"
              }`}
            >
              <div className="flex items-start justify-between gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="opacity-50">{selectedFontNames}</span>
                  <span className="text-[11px]">cc by 4.0 자유롭게 공유/복제/수정 가능, 저작자 표시</span>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  className="shrink-0"
                >
                  <X size={18} className="hover:opacity-50 transition-opacity" />
                </button>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <input
                  id="font-order-name"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  className="bg-transparent border-b border-stone-900 pb-1 focus:outline-hidden"
                  placeholder="이름"
                />
              </div>
              <div className="flex flex-col gap-2 pb-2">
                <input
                  id="font-order-email"
                  type="email"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  className="bg-transparent border-b border-stone-900 pb-1 focus:outline-hidden"
                  placeholder="이메일"
                />
              </div>
              <button
                type="button"
                onClick={sendSelectedFonts}
                disabled={isSending || !customerName.trim() || !customerEmail.trim()}
                className="self-start bg-stone-900 text-background font-semibold rounded-sm px-5 py-2 disabled:opacity-60 hover:opacity-50 transition-opacity"
              >
                다운로드
              </button>
              {sendState.type !== "idle" ? (
                <div className="text-sm text-text-800">
                  {sendState.message}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
