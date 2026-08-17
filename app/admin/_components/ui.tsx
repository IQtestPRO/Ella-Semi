"use client";

import {
  useState,
  type ReactNode,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

/**
 * Átomos de UI do painel /admin — pensados para uma pessoa leiga: rótulos
 * claros em pt-BR, textos de ajuda, alvos de toque grandes, feedback explícito
 * de "salvo" / erro. Visual limpo e calmo (warm), utilitário (clareza > glam).
 */

// ── chamada à API com feedback ──────────────────────────────────────────────

export async function apiSend(
  method: "POST" | "PUT" | "DELETE",
  url: string,
  body?: unknown,
): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: (data as { error?: string }).error ?? "Erro inesperado." };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Sem conexão. Tente de novo." };
  }
}

// ── containers ──────────────────────────────────────────────────────────────

export function Card({
  title,
  description,
  children,
  footer,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--color-areia)] bg-white shadow-sm">
      {(title || description) && (
        <header className="border-b border-[var(--color-areia)]/70 px-5 py-4 md:px-6">
          {title && (
            <h2 className="text-lg font-semibold text-[var(--color-preto-warm)]">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-[var(--color-taupe)]">{description}</p>
          )}
        </header>
      )}
      <div className="px-5 py-5 md:px-6">{children}</div>
      {footer && (
        <footer className="flex items-center justify-end gap-3 border-t border-[var(--color-areia)]/70 px-5 py-4 md:px-6">
          {footer}
        </footer>
      )}
    </section>
  );
}

/**
 * Passo numerado. Dá ordem visual ao formulário ("preencha 1, depois 2") em vez
 * de uma parede de campos. Título grande porque a leitura precisa funcionar
 * para quem enxerga mal.
 */
export function StepCard({
  step,
  title,
  hint,
  children,
  footer,
}: {
  step: number | string;
  title: string;
  hint?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--color-areia)] bg-white shadow-sm">
      <header className="flex items-start gap-3 border-b border-[var(--color-areia)]/70 px-4 py-4 md:px-6">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-preto-warm)] text-base font-semibold text-[var(--color-salmao-claro)]"
        >
          {step}
        </span>
        <span className="min-w-0">
          <h2 className="text-xl font-semibold leading-tight text-[var(--color-preto-warm)]">
            {title}
          </h2>
          {hint && (
            <p className="mt-1 text-[15px] leading-snug text-[var(--color-taupe)]">
              {hint}
            </p>
          )}
        </span>
      </header>
      <div className="px-4 py-5 md:px-6">{children}</div>
      {footer && (
        <footer className="flex items-center justify-end gap-3 border-t border-[var(--color-areia)]/70 px-4 py-4 md:px-6">
          {footer}
        </footer>
      )}
    </section>
  );
}

/**
 * Gaveta fechada por padrão. Tudo que uma pessoa leiga NUNCA precisa mexer
 * (código interno, banho, tipo, link de vídeo) mora aqui — fora do caminho
 * principal, mas sem perder o recurso para quem precisa.
 */
export function Advanced({
  children,
  label = "Opções avançadas",
  hint = "Você quase nunca precisa mexer aqui.",
}: {
  children: ReactNode;
  label?: string;
  hint?: string;
}) {
  return (
    <details className="group rounded-2xl border border-dashed border-[var(--color-areia)] bg-white/60">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-4 md:px-6 [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden="true"
          className="text-[var(--color-taupe)] transition-transform duration-200 ease-brand group-open:rotate-90"
        >
          ▸
        </span>
        <span className="text-[15px] font-medium text-[var(--color-preto-warm)]">
          {label}
        </span>
        <span className="text-sm text-[var(--color-taupe)]">— {hint}</span>
      </summary>
      <div className="border-t border-[var(--color-areia)]/70 px-4 py-5 md:px-6">
        {children}
      </div>
    </details>
  );
}

// ── campos ──────────────────────────────────────────────────────────────────

export function Label({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <span className="mb-1.5 block">
      <span className="text-sm font-medium text-[var(--color-preto-warm)]">
        {children}
      </span>
      {hint && (
        <span className="ml-2 text-xs text-[var(--color-taupe)]">{hint}</span>
      )}
    </span>
  );
}

const fieldClass =
  // text-base no mobile: iOS Safari dá zoom na página quando foca input <16px
  "w-full rounded-xl border border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/40 px-4 py-3 text-base md:text-[15px] text-[var(--color-preto-warm)] outline-none transition focus:border-[var(--color-dourado-claro)] focus:bg-white focus:ring-2 focus:ring-[var(--color-dourado-claro)]/40";

export function TextInput(
  props: InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string },
) {
  const { label, hint, className, ...rest } = props;
  return (
    <label className="block">
      {label && <Label hint={hint}>{label}</Label>}
      <input className={`${fieldClass} ${className ?? ""}`} {...rest} />
    </label>
  );
}

export function TextArea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    hint?: string;
  },
) {
  const { label, hint, className, ...rest } = props;
  return (
    <label className="block">
      {label && <Label hint={hint}>{label}</Label>}
      <textarea
        className={`${fieldClass} min-h-[96px] resize-y leading-relaxed ${className ?? ""}`}
        {...rest}
      />
    </label>
  );
}

export function Select({
  label,
  hint,
  value,
  onChange,
  options,
}: {
  label?: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      {label && <Label hint={hint}>{label}</Label>}
      <select
        className={fieldClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/**
 * Preço em reais, com o "R$" dentro do campo e teclado numérico no celular.
 * Fonte grande: valor é o dado que mais gera medo de errar.
 */
export function PriceInput({
  label,
  hint,
  value,
  onChange,
  placeholder = "69,90",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <Label hint={hint}>{label}</Label>
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-[var(--color-taupe)]"
        >
          R$
        </span>
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/40 py-3 pl-12 pr-4 text-lg font-medium text-[var(--color-preto-warm)] outline-none transition focus:border-[var(--color-dourado-claro)] focus:bg-white focus:ring-2 focus:ring-[var(--color-dourado-claro)]/40"
        />
      </div>
    </label>
  );
}

export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-[var(--color-areia)] bg-white px-4 py-3 text-left transition hover:border-[var(--color-dourado-claro)]"
    >
      <span>
        <span className="block text-sm font-medium text-[var(--color-preto-warm)]">
          {label}
        </span>
        {hint && (
          <span className="mt-0.5 block text-xs text-[var(--color-taupe)]">
            {hint}
          </span>
        )}
      </span>
      <span
        className="relative h-7 w-12 flex-shrink-0 rounded-full transition-colors"
        style={{
          backgroundColor: checked
            ? "var(--color-preto-warm)"
            : "var(--color-areia)",
        }}
      >
        <span
          className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-out-soft"
          style={{ transform: checked ? "translateX(1.25rem)" : "translateX(0)" }}
        />
      </span>
    </button>
  );
}

// ── botões ──────────────────────────────────────────────────────────────────

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-[background-color,border-color,transform] duration-150 ease-brand active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  const styles: Record<string, string> = {
    primary:
      "bg-[var(--color-preto-warm)] text-[var(--color-salmao-claro)] hover:bg-[#3A2013]",
    ghost:
      "border border-[var(--color-areia)] bg-white text-[var(--color-preto-warm)] hover:border-[var(--color-taupe)] hover:bg-[var(--color-salmao-claro)]/40",
    danger: "bg-[#b3261e] text-white hover:bg-[#9a1f18]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

/** Hook de estado de salvamento: status + mensagem para feedback ao usuário. */
export function useSaveState() {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string>("");

  async function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setStatus("saving");
    setMessage("");
    const res = await fn();
    if (res.ok) {
      setStatus("saved");
      setMessage("Salvo! Já aparece no site.");
      setTimeout(() => setStatus("idle"), 2500);
    } else {
      setStatus("error");
      setMessage(res.error ?? "Não deu certo.");
    }
    return res.ok;
  }

  return { status, message, run };
}

export function SaveBar({
  status,
  message,
  onSave,
  saveLabel = "Salvar",
  extra,
}: {
  status: "idle" | "saving" | "saved" | "error";
  message?: string;
  onSave: () => void;
  saveLabel?: string;
  extra?: ReactNode;
}) {
  return (
    <div className="flex w-full flex-wrap items-center justify-end gap-3">
      {message && (
        <span
          className={`mr-auto text-sm ${
            status === "error"
              ? "text-[#b3261e]"
              : "text-[var(--color-taupe)]"
          }`}
        >
          {message}
        </span>
      )}
      {extra}
      <Button
        onClick={onSave}
        disabled={status === "saving"}
        className={status === "saved" ? "bg-[#4a6741]!" : undefined}
      >
        {status === "saving"
          ? "Salvando…"
          : status === "saved"
            ? "Salvo ✓"
            : saveLabel}
      </Button>
    </div>
  );
}
