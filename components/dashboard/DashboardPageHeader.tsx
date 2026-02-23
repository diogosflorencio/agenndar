"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DashboardPageHeaderProps {
  title: string;
  backHref?: string;
  right?: React.ReactNode;
}

export default function DashboardPageHeader({
  title,
  backHref = "/dashboard",
  right,
}: DashboardPageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-dash-surface/95 backdrop-blur-md border-b border-dash-border">
      <div className="flex items-center px-4 h-14 justify-between max-w-md mx-auto">
        <Link
          href={backHref}
          className="h-10 w-10 flex items-center justify-center -ml-2 text-dash-text-muted hover:text-dash-text transition-colors"
        >
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-base font-bold text-dash-text">{title}</h1>
        <div className="w-10 flex items-center justify-end">{right ?? null}</div>
      </div>
    </header>
  );
}
