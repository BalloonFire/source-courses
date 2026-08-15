"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export const SearchInput = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery);
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: debouncedSearchQuery || undefined,
                categoryId: currentCategoryId || undefined,
            },
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    }, [debouncedSearchQuery, currentCategoryId, pathname, router]);

    return (
        <div className="relative w-full md:w-80">
            <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
            <Input
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                className="w-full pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
                placeholder="Search for a course"
            />
        </div>
    )
}
