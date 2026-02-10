type IconButtonProps = {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
};

export default function IconButton({ children, label, onClick, className }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 ${className ?? ""}`}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
