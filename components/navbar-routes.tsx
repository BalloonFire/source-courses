"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "./ui/button";
import { SearchInput } from "./search-input";

export const NavbarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isPlayerPage = pathname?.includes("/player");
    const isSearchPage = pathname === "/search";

    return (
        <>
            {isSearchPage && (
                <div className="flex flex-1 items-center mr-4">
                    <SearchInput />
                </div>
            )}
            <div className="flex items-center ml-auto gap-x-2">
                {isTeacherPage || isPlayerPage ? (
                    <Link href="/">
                        <Button  size="sm" variant="outline">
                            <LogOut className="h-4 w-4 mr-2"/>
                            Exit
                        </Button>
                    </Link>
                ) : (
                    <Link href="/teacher/courses">
                        <Button size="sm" variant="outline">
                            Teacher Mode
                        </Button>
                    </Link>
                )}
                <UserButton />
            </div>
        </>
    )
}