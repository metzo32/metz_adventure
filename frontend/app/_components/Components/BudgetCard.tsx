interface BudgetCardProps {
  bgColor: string;
  title: string;
  titleColor?: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function BudgetCard({
  bgColor,
  title,
  titleColor = "",
  icon,
  content,
}: BudgetCardProps) {
  return (
    <div className={`${bgColor} rounded-2xl p-5 shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-medium ${titleColor}`}>{title}</span>
        {icon}
      </div>
      {content}
    </div>
  );
}
