"use client";

import { Children, cloneElement, isValidElement, useId, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function AdminPageHeader({ title, description, eyebrow, actions }: { title: string; description: string; eyebrow?: string; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p> : null}
        <h1 className="text-2xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-[1.75rem]">{title}</h1>
        <p className="mt-2 max-w-2xl text-[13px] leading-6 text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex max-w-full shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function AdminPanel({ children, className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("min-w-0 rounded-xl border border-border/70 bg-card shadow-[0_2px_8px_rgba(48,42,36,0.025)]", className)} {...props}>{children}</div>;
}

export function AdminStatus({ status }: { status: string }) {
  const tone = status === "visible" || status === "confirmed"
    ? "border-emerald-600/15 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300"
    : status === "pending" || status === "hidden"
      ? "border-amber-600/15 bg-amber-500/8 text-amber-700 dark:text-amber-300"
      : status === "shipped"
        ? "border-sky-600/15 bg-sky-500/8 text-sky-700 dark:text-sky-300"
        : "border-border/70 bg-surface-silver text-muted-foreground";
  return <span className={cn("inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-medium capitalize leading-none", tone)}><span className="size-1.5 rounded-full bg-current" aria-hidden="true" />{status}</span>;
}

export function AdminEmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div role="status" className="flex flex-col items-center px-5 py-14 text-center"><span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-surface-silver text-muted-foreground"><SearchX className="size-5" aria-hidden="true" /></span><h2 className="text-sm font-semibold">{title}</h2><p className="mt-2 max-w-sm text-xs leading-6 text-muted-foreground">{description}</p>{action ? <div className="mt-4">{action}</div> : null}</div>;
}

export function AdminPagination({ page, pageSize, total, onPageChange }: { page: number; pageSize: number; total: number; onPageChange: (page: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
      <p aria-live="polite">{total ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total}` : "0 results"}</p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="size-8 rounded-md" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><ChevronLeft className="size-4" /></Button>
        <span className="min-w-16 text-center">{page} / {pages}</span>
        <Button variant="outline" size="icon" className="size-8 rounded-md" aria-label="Next page" disabled={page >= pages} onClick={() => onPageChange(page + 1)}><ChevronRight className="size-4" /></Button>
      </div>
    </div>
  );
}

export function AdminEditor({ title, description, children, footer, finalFocus }: { title: string; description: string; children: ReactNode; footer: ReactNode; finalFocus?: React.ComponentProps<typeof DialogContent>["finalFocus"] }) {
  return (
    <DialogContent finalFocus={finalFocus} position="mobile-sheet" className="admin-editor flex flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
      <DialogHeader className="shrink-0 border-b border-border/70 p-5 pr-14">
        <DialogTitle className="font-sans text-lg font-semibold leading-6 tracking-tight">{title}</DialogTitle>
        <DialogDescription className="text-xs leading-5">{description}</DialogDescription>
      </DialogHeader>
      <div className="min-h-0 overflow-y-auto overscroll-contain p-5">{children}</div>
      <DialogFooter className="m-0 shrink-0 rounded-none bg-surface-silver/50 px-5 py-4">{footer}</DialogFooter>
    </DialogContent>
  );
}

export function AdminField({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  const id = useId();
  return <div className={cn("min-w-0", className)}><label htmlFor={id} className="mb-2 block text-xs font-medium text-foreground">{label}</label>{Children.map(children, (child) => isValidElement<{ id?: string }>(child) && (child.type === Input || child.type === Textarea || child.type === "select") ? cloneElement(child, { id }) : child)}</div>;
}
