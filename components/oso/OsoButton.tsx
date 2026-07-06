import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type OsoButtonVariant = "primary" | "secondary" | "dark" | "ghost";
type OsoButtonSize = "sm" | "md" | "lg";

type BaseButtonProps = {
  children: ReactNode;
  variant?: OsoButtonVariant;
  size?: OsoButtonSize;
  className?: string;
};

type OsoButtonLinkProps = BaseButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

type OsoButtonActionProps = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type OsoButtonProps = OsoButtonLinkProps | OsoButtonActionProps;

const buttonBaseClass =
  "group relative isolate inline-flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-full border text-center font-extrabold uppercase leading-none whitespace-nowrap transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const buttonSizeClasses: Record<OsoButtonSize, string> = {
  sm: "min-h-11 gap-2 px-5 py-2.5 text-xs tracking-[0.035em]",
  md: "min-h-[3.25rem] gap-2.5 px-6 py-3.5 text-sm tracking-[0.035em]",
  lg: "min-h-14 gap-3 px-7 py-4 text-sm tracking-[0.035em]",
};

const buttonVariantClasses: Record<OsoButtonVariant, string> = {
  primary:
    "border-blue-300/40 bg-[linear-gradient(135deg,rgba(37,99,235,0.96),rgba(14,165,233,0.94),rgba(34,211,238,0.9))] text-white shadow-[0_18px_42px_rgba(37,99,235,0.22),inset_0_1px_0_rgba(255,255,255,0.34)] hover:-translate-y-0.5 hover:border-cyan-200/70 hover:shadow-[0_24px_58px_rgba(37,99,235,0.30),0_0_34px_rgba(34,211,238,0.22),inset_0_1px_0_rgba(255,255,255,0.42)]",
  secondary:
    "border-slate-300/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(239,246,255,0.76),rgba(224,242,254,0.78))] text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.82)] hover:-translate-y-0.5 hover:border-blue-300/70 hover:text-blue-700 hover:shadow-[0_20px_48px_rgba(37,99,235,0.14),0_0_26px_rgba(34,211,238,0.12),inset_0_1px_0_rgba(255,255,255,0.86)]",
  dark:
    "border-slate-900/20 bg-[linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)] text-white shadow-[0_18px_42px_rgba(15,23,42,0.24),inset_0_1px_0_rgba(255,255,255,0.22)] hover:-translate-y-0.5 hover:border-blue-300/60 hover:shadow-[0_24px_58px_rgba(15,23,42,0.28),0_0_28px_rgba(37,99,235,0.18)]",
  ghost:
    "border-slate-200/80 bg-white/70 text-slate-800 shadow-[0_10px_28px_rgba(15,23,42,0.055),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/80 hover:text-blue-700",
};

export function OsoButton(props: OsoButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
  } = props;

  const classNames = cn(
    buttonBaseClass,
    buttonSizeClasses[size],
    buttonVariantClasses[variant],
    "font-[var(--font-body)]",
    className,
  );

  const content = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1px] -z-10 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.08)_42%,rgba(255,255,255,0.20))] opacity-70"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-1/3 -top-[120%] -z-10 h-[320%] w-[42%] rotate-[24deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.48),transparent)] opacity-0 transition-all duration-500 group-hover:left-[120%] group-hover:opacity-100"
      />

      <span className="relative z-10 inline-flex min-w-0 items-center justify-center gap-2.5 whitespace-nowrap leading-none [&_svg]:shrink-0">
        {children}
      </span>
    </>
  );

  if (typeof props.href === "string") {
    const {
      href,
      children: _children,
      variant: _variant,
      size: _size,
      className: _className,
      ...anchorProps
    } = props;

    return (
      <Link href={href} className={classNames} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const {
    children: _children,
    variant: _variant,
    size: _size,
    className: _className,
    href: _href,
    type = "button",
    ...buttonProps
  } = props;

  return (
    <button type={type} className={classNames} {...buttonProps}>
      {content}
    </button>
  );
}

type OsoIconButtonTone = "dark" | "blue" | "light";
type OsoIconButtonSize = "sm" | "md" | "lg";

type OsoIconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  icon: ReactNode;
  label: string;
  tone?: OsoIconButtonTone;
  size?: OsoIconButtonSize;
};

const iconButtonSizeClasses: Record<OsoIconButtonSize, string> = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14",
};

const iconButtonToneClasses: Record<OsoIconButtonTone, string> = {
  dark: "border-slate-200 bg-white/80 text-slate-950 shadow-[0_12px_28px_rgba(15,23,42,0.10)] hover:border-blue-200 hover:text-blue-700",
  blue: "border-blue-200 bg-blue-50/90 text-blue-700 shadow-[0_12px_28px_rgba(37,99,235,0.12)] hover:border-blue-300 hover:bg-blue-100",
  light:
    "border-white/70 bg-white/80 text-slate-950 shadow-[0_14px_32px_rgba(15,23,42,0.16),inset_0_1px_0_rgba(255,255,255,0.82)] hover:text-blue-700",
};

export function OsoIconButton({
  icon,
  label,
  tone = "dark",
  size = "md",
  className = "",
  type = "button",
  ...props
}: OsoIconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full border transition duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        iconButtonSizeClasses[size],
        iconButtonToneClasses[tone],
        className,
      )}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center justify-center [&_svg]:h-5 [&_svg]:w-5 [&_svg]:stroke-current">
        {icon}
      </span>
    </button>
  );
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}