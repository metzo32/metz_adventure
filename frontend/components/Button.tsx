import React from 'react'


interface ButtonProps {
    children: React.ReactNode;
    mode?: "full" | "light" | "plain" | "nav" | "filter";
    onClick: () => void;
    className?: string;
    isOpen?: boolean;
    isActive?: boolean;
}

export function Button({ children, mode = "full", onClick, className, isOpen, isActive }: ButtonProps) {

    const baseClass =
        "transition-colors shadow-sm text-sm px-4 py-2 ";

    const fullClass =
        "bg-primary hover:bg-blue-800 rounded-lg text-white font-medium";

    const lightClass =
        "bg-white text-primary hover:bg-blue-50 rounded-lg  font-bold whitespace-nowrap transition-all";

    const navClass = `
        w-full flex items-center gap-3 px-3 py-2 rounded-lg
        text-slate-500 hover:bg-slate-100 hover:text-slate-700
        transition-colors duration-150
        shadow-none!
        ${isOpen ? "" : "justify-center"}
    `;

    const filterClass =
        `px-3 py-1 rounded-full text-xs font-medium border transition shadow-none! ${isActive
            ? "bg-primary text-white border-primary"
            : "bg-white text-text-secondary border-border hover:border-primary"
        }`;

    return (
        <button
            onClick={onClick}
            className={`
                ${baseClass}
                ${mode === "full" && fullClass}
                ${mode === "light" && lightClass}
                ${mode === "nav" && navClass}
                ${mode === "filter" && filterClass}
                ${className}
                `
            }
        >
            {children}
        </button>
    )
}
