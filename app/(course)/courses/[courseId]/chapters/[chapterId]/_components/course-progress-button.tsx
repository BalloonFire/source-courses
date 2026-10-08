"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isCompleted?: boolean;
}

export const CourseProgressButton = ({
    courseId,
    chapterId,
    nextChapterId,
    isCompleted,
}: CourseProgressButtonProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted
            });

            if (!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }

            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            toast.success(`Chapter marked as ${!isCompleted ? "complete" : "incomplete"}.`);
            router.refresh();
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    const Icon = isCompleted ? XCircle : CheckCircle;

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            type = "button"
            variant={isCompleted ? "outline" : "success"}
            className="w-auto shrink-0"
        >
            <Icon className="h-4 w-4" ml-2/>
            {isCompleted ? "Mark as incomplete" : "Mark as complete"}
        </Button>
    );
}