import Link from "next/link";

interface LinkPresetProps {
    href: string;
    mode?: "full" | "light" | "plain" | "nav";
    children: React.ReactNode;
    className?: string;
    isOpen?: boolean;
    isActive?: boolean;
    title?: string;
}


export function LinkPreset({ href, mode = "full", children, className, isOpen, isActive, title }: LinkPresetProps) {

    const baseClass =
        "transition-colors shadow-sm rounded-lg text-sm px-4 py-2 ";

    const fullClass =
        "bg-primary hover:bg-blue-800 text-white font-medium";

    const lightClass =
        "bg-white text-primary hover:bg-blue-50 font-bold whitespace-nowrap transition-all";

    const navClass = `
        flex items-center gap-3 px-3 py-2.5 rounded-lg
        transition-colors duration-150 group
        ${isOpen ? "" : "justify-center"}
        ${isActive
            ? "bg-blue-50 text-blue-600"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }
    `;


    return (
        <Link
            href={href}
            title={title}
            className={
                mode === "nav"
                    ? navClass
                    : `
                ${baseClass}
                ${mode === "full" ? fullClass : ""}
                ${mode === "light" ? lightClass : ""}
                ${className}
                `
            }
        >
            {children}
        </Link>
    );
}


