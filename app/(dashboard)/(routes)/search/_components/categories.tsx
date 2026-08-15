"use client";

import { Category } from "@prisma/client";
import {
    FcEngineering,
    FcCalculator,
    FcMoneyTransfer,
    FcTimeline,
    FcPicture,
    FcBriefcase,
    FcSportsMode,
    FcMindMap,
    FcGlobe
} from "react-icons/fc";

import { IconType } from "react-icons";
import { CategoryItem } from "./categoryitem";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Computer Science": FcEngineering,
    "Mathematics": FcCalculator,
    "Accounting": FcMoneyTransfer,
    "History": FcTimeline,
    "Art": FcPicture,
    "Engineering": FcEngineering,
    "Business": FcBriefcase,
    "Health & Fitness": FcSportsMode,
    "Personal Development": FcMindMap,
    "Language Learning": FcGlobe,
}

const colorMap: Record<Category["name"], string> = {
    "Computer Science": "#3b82f6",
    "Mathematics": "#f59e0b",
    "Accounting": "#10b981",
    "History": "#8b5cf6",
    "Art": "#ec4899",
    "Engineering": "#ef4444",
    "Business": "#06b6d4",
    "Health & Fitness": "#84cc16",
    "Personal Development": "#f97316",
    "Language Learning": "#6366f1",
}

export const Categories = ({
    items
}: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                    color={colorMap[item.name]}
                />
            ))}
        </div>
    )
}