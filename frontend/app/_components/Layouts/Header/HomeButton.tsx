import Image from "next/image";
import Link from "next/link";
import logo from "@/public/icons/logo_primary.svg"

export default function HomeButton() {
    return (
        <Link href="/" className="flex items-center gap-2.5">
            <Image src={logo} alt="logo" width={20} height={20} priority />
            <span className="hidden md:block font-bold text-slate-800 text-base">떠나세연</span>
        </Link>
    )
}
