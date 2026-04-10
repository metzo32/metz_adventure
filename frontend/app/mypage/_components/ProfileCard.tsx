"use client";

import { useSession, signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Logout, FlightTakeoff, AccountBalanceWallet } from "@mui/icons-material";
import { Button } from "@/components/Button";
import { fetchMyTrips } from "@/app/api/trips";
import { fetchPastTrips } from "@/app/api/mypage";

const STAT_ITEMS = (tripCount: number, totalExpense: number) => [
  {
    label: "총 여행",
    value: `${tripCount}개`,
    icon: FlightTakeoff,
  },
  {
    label: "총 지출",
    value: `${totalExpense.toLocaleString()}원`,
    icon: AccountBalanceWallet,
  },
];


const ProfileCard = () => {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const initial = name ? name[0].toUpperCase() : "?";

  const { data: allTrips = [] } = useQuery({
    queryKey: ["trips", userId],
    queryFn: () => fetchMyTrips(userId),
    enabled: !!userId,
  });

  const { data: pastTrips = [] } = useQuery({
    queryKey: ["pastTrips", userId],
    queryFn: () => fetchPastTrips(userId),
    enabled: !!userId,
  });

  const totalExpense = pastTrips.reduce((sum, t) => sum + Number(t.total_expense_krw), 0);
  const stats = STAT_ITEMS(allTrips.length, totalExpense);
  console.log(totalExpense)

  const handleSignOut = () => signOut({ callbackUrl: "/auth/login" });

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-white text-xl font-bold">{initial}</span>
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">{name}</p>
            <p className="text-text-secondary text-sm">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-lighter flex items-center justify-center">
                <Icon sx={{ fontSize: 16, color: "#0832A4" }} />
              </div>
              <p className="text-foreground font-semibold text-sm">{value}</p>
              <p className="text-text-secondary text-xs">{label}</p>
            </div>
          ))}

          <Button mode="light" onClick={handleSignOut}>
            <span className="flex items-center gap-1">
              <Logout sx={{ fontSize: 16 }} />
              로그아웃
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
