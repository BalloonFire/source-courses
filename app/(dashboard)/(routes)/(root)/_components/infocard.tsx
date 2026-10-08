import { IconBadge } from "@/components/icon-badge";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
    icon: LucideIcon;
    label: string;
    numberOfItems: number;
    variant?: "default" | "success";
}

export const InfoCard = ({ variant, icon: Icon, label, numberOfItems }: InfoCardProps) => {
    return (
        <div className="border rounded-md flex items-center gap-x-2 p-3">
            <IconBadge icon={Icon} variant={variant} />
            <div>
                <p className="font-medium">
                    {label}
                </p>
                <p className="text-sm text-gray-500">
                    {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
                </p>
            </div>
        </div>
    )
}