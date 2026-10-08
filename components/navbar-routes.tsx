"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "./ui/button";
import { SearchInput } from "./search-input";
import { isTeacher } from "@/lib/teacher";

export const NavbarRoutes = () => {
    const { userId } = useAuth();
    const pathname = usePathname();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/courses");
    const isSearchPage = pathname === "/search";

    return (
        <>
            {isSearchPage && (
                <div className="flex flex-1 items-center mr-4">
                    <SearchInput />
                </div>
            )}
            <div className="flex items-center ml-auto gap-x-2">
                {isTeacherPage || isCoursePage ? (
                    <Link href="/">
                        <Button  size="sm" variant="outline">
                            <LogOut className="h-4 w-4 mr-2"/>
                            Exit
                        </Button>
                    </Link>
                ) : isTeacher(userId ?? null) ? (
                    <Link href="/teacher/courses">
                        <Button size="sm" variant="outline">
                            Teacher Mode
                        </Button>
                    </Link>
                ) : null}
                <UserButton />
            </div>
        </>
    )
}