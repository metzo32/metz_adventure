import React from "react";

interface TagsProps {
    children: React.ReactNode;
    colSpan?: number;
    className?: string;
}

export function Td({ children, colSpan, className }: TagsProps) {
    return (
        <td colSpan={colSpan} className={`py-2 px-4 ${className}`}>
            {children}
        </td>
    )
}

