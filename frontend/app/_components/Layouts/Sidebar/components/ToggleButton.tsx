import { Button } from '@/components/Button'
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";


interface ToggleButtonProps {
    onToggleClick: () => void;
    isOpen: boolean;
}

export default function ToggleButton({ onToggleClick, isOpen }: ToggleButtonProps) {
    return (
        <div className="py-3 px-2 border-b border-border">
            <Button onClick={onToggleClick} mode="nav" isOpen={isOpen}>
                {isOpen ? (
                    <>
                        <ChevronLeftIcon fontSize="small" className="shrink-0" />
                        <span className="text-sm font-medium whitespace-nowrap">접기</span>
                    </>
                ) : (
                    <ChevronRightIcon fontSize="small" className="shrink-0" />
                )}
            </Button>
        </div>
    )
}
