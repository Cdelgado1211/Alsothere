interface Props {
  title: string;
  description?: string;
}

export const EmptyState = ({ title, description }: Props) => (
  <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-slate-400">
    <p className="font-medium text-slate-200">{title}</p>
    {description && <p>{description}</p>}
  </div>
);

