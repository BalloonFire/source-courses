"use client";

import { IconType } from "react-icons";
import qs from "query-string";
import { cn } from "@/lib/utils";
import { 
    usePathname, 
    useRouter, 
    useSearchParams 
} from "next/navigation";

interface CategoryItemProps {
    label: string;
    icon?: IconType;
    value?: string;
    color?: string;
}

export const CategoryItem = ({
    label,
    value,
    icon: Icon,
    color = "#0ea5e9",
}: CategoryItemProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategory = searchParams.get("categoryId");
    const currentSearchTitle = searchParams.get("title");

    const isSelected = currentCategory === value;

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: currentSearchTitle || undefined,
                categoryId: isSelected ? undefined : value,
            },
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    };

    return (
        <button 
            onClick={onClick}
            className={cn(
                "py-2 px-3 text-sm border-2 rounded-full flex items-center gap-x-2 transition duration-200",
                !isSelected && "border-slate-200"
            )}
            style={isSelected ? {
                borderColor: color,
                backgroundColor: "rgb(233, 234, 236)",
            } : {}}
            onMouseEnter={(e) => {
                if (!isSelected) {
                    e.currentTarget.style.borderColor = color;
                }
            }}
            onMouseLeave={(e) => {
                if (!isSelected) {
                    e.currentTarget.style.borderColor = "rgb(226, 232, 240)";
                }
            }}
            type="button"
        >
            {Icon && <Icon size={20} />}
            <div className="truncate">
                {label}
            </div>
        </button>
    )
}