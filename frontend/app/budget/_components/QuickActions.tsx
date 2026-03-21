import AddCircleIcon from "@mui/icons-material/AddCircle";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const QUICK_ACTIONS = [
  { label: "지출 추가", Icon: AddCircleIcon, primary: true, key: "add" },
  { label: "교통비", Icon: DirectionsBusIcon, primary: false, key: "transport" },
  { label: "식비", Icon: RestaurantIcon, primary: false, key: "food" },
  { label: "쇼핑", Icon: ShoppingBagIcon, primary: false, key: "shopping" },
  { label: "관광", Icon: CameraAltIcon, primary: false, key: "tour" },
];

const makeHandleAction = (onAction: (key: string) => void, key: string) => () =>
  onAction(key);

interface QuickActionsProps {
  onAction: (key: string) => void;
}

export default function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {QUICK_ACTIONS.map(({ label, Icon, primary, key }) => (
        <button
          key={key}
          onClick={makeHandleAction(onAction, key)}
          className={`flex flex-col items-center gap-2 py-4 rounded-2xl font-medium text-sm transition-all shadow-sm cursor-pointer
            ${primary
              ? "bg-[#0832A4] text-white hover:bg-blue-900"
              : "bg-white text-[#0F172A] hover:bg-slate-50"
            }`}
        >
          <div className={`p-2 rounded-full ${primary ? "bg-white/20" : "bg-[#EFF6FF]"}`}>
            <Icon
              className={primary ? "text-white" : "text-[#0832A4]"}
              fontSize="small"
            />
          </div>
          {label}
        </button>
      ))}
    </div>
  );
}
