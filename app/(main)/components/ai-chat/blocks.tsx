"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Info, Lightbulb, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Card from "../card";
import type { AiBlock } from "@/types/ai_types";

const TONES: Record<"info" | "tip" | "warning", { cls: string; Icon: LucideIcon }> = {
  info: { cls: "border-sky-200 bg-sky-50 text-sky-900", Icon: Info },
  tip: { cls: "border-green-200 bg-green-50 text-green-900", Icon: Lightbulb },
  warning: { cls: "border-amber-200 bg-amber-50 text-amber-900", Icon: TriangleAlert },
};

type Props = {
  blocks: AiBlock[];
  isLast: boolean;
  onSuggest: (text: string) => void;
  onNavigate: () => void; // closes the chat when the user leaves
};

export default function Blocks({ blocks, isLast, onSuggest, onNavigate }: Props) {
  return (
    <div className="w-full space-y-2.5">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "text":
            return (
              <div
                key={i}
                className="w-fit max-w-full whitespace-pre-wrap rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800"
              >
                {b.text}
              </div>
            );

          case "products":
            return (
              <div key={i}>
                {b.title && <p className="mb-2 text-sm font-semibold text-slate-700">{b.title}</p>}
                <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2">
                  {b.products.map((p) => (
                    <Link key={p.id} href={p.href} onClick={onNavigate} className="block w-44 shrink-0 snap-start">
                      <Card
                        img={p.img}
                        Title={p.title}
                        Discribe={p.description}
                        Rate={p.rating}
                        Price={p.price}
                        OriginalPrice={p.originalPrice}
                        Discount={p.discount}
                        Brand={p.brand}
                        Reviews={p.reviews}
                        Stock={p.stock}
                        IsNew={p.isNew}
                        Tag={p.tag}
                      />
                    </Link>
                  ))}
                </div>
                {b.viewAllHref && (
                  <Link
                    href={b.viewAllHref}
                    onClick={onNavigate}
                    className="inline-flex items-center gap-1 text-sm font-medium text-sky-700 hover:underline"
                  >
                    View all results <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            );

          case "redirect":
            return <RedirectBlock key={i} block={b} active={isLast} onNavigate={onNavigate} />;

          case "list":
            return (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-3.5 text-sm text-slate-800">
                {b.title && <p className="mb-2 font-semibold">{b.title}</p>}
                {b.style === "steps" ? (
                  <ol className="space-y-2">
                    {b.items.map((it, j) => (
                      <li key={j} className="flex gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-600 text-xs font-semibold text-white">
                          {j + 1}
                        </span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ul className="list-disc space-y-1 pl-5">
                    {b.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                )}
              </div>
            );

          case "callout": {
            const { cls, Icon } = TONES[b.tone];
            return (
              <div key={i} className={`flex gap-2 rounded-xl border p-3 text-sm ${cls}`}>
                <Icon size={16} className="mt-0.5 shrink-0" />
                <span>{b.text}</span>
              </div>
            );
          }

          case "suggestions":
            if (!isLast) return null; // only the newest reply shows chips
            return (
              <div key={i} className="flex flex-wrap gap-2 pt-1">
                {b.items.map((s) => (
                  <button
                    key={s}
                    onClick={() => onSuggest(s)}
                    className="rounded-full border border-sky-300 bg-white px-3 py-1 text-xs font-medium text-sky-700 transition hover:bg-sky-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            );
        }
      })}
    </div>
  );
}

function RedirectBlock({
  block,
  active,
  onNavigate,
}: {
  block: Extract<AiBlock, { type: "redirect" }>;
  active: boolean;
  onNavigate: () => void;
}) {
  const router = useRouter();
  const [cancelled, setCancelled] = useState(false);
  const pending = block.auto && !block.external && active && !cancelled;

  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => {
      router.push(block.path);
      onNavigate();
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, block.path]);

  const btn =
    "inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 font-medium text-white hover:bg-sky-700";

  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3.5 text-sm">
      {block.reason && <p className="mb-2 text-slate-700">{block.reason}</p>}
      <div className="flex items-center gap-3">
        {block.external ? (
          <a href={block.path} target="_blank" rel="noopener noreferrer" className={btn}>
            Open {block.label} <ArrowRight size={14} />
          </a>
        ) : (
          <Link href={block.path} onClick={onNavigate} className={btn}>
            Open {block.label} <ArrowRight size={14} />
          </Link>
        )}
        {pending && (
          <span className="text-xs text-slate-500">
            Taking you there…{" "}
            <button onClick={() => setCancelled(true)} className="font-medium text-sky-700 underline">
              Cancel
            </button>
          </span>
        )}
      </div>
    </div>
  );
}