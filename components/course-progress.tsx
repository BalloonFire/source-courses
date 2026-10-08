import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";

interface CourseProgressProps {
    variant?: "default" | "success";
    size?: "default" | "sm";
    value: number;
}

const colorVariants = {
    default: "text-sky-500",
    success: "text-emerald-700",
};

const sizeVariants = {
    default: "text-sm",
    sm: "text-xs",
};

export const CourseProgress = ({ 
    variant, 
    size, 
    value,
}: CourseProgressProps) => {
    return (
        <div>
            <Progress 
                className="h-2"
                value={value}
                variant={variant}
            />
            <p className={cn(
                colorVariants[variant || "default"],
                sizeVariants[size || "default"],
                "mt-2 font-medium text-sky-700"
            )}>
                {Math.round(value)}% completed
            </p>
        </div>
    );
}