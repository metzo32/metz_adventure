import Link from "next/link";

interface LinkPresetProps {
    href: string;
    mode?: "full" | "plain";
    children: React.ReactNode;
}

export default function LinkPreset({ href, mode = "full", children }: LinkPresetProps) {
    return (
        <Link
            href={href}
            className={`text-sm font-medium transition-colors shadow-sm text-white px-4 py-2 rounded-lg ${
                mode === "full" ? "bg-blue-600 hover:bg-blue-700" : ""
            }`}
        >
            {children}
        </Link>
    );
}
