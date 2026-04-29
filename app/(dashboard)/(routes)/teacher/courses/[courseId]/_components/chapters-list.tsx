"use client"

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChaptersListProps {
    items: Chapter[];
    onEdit: (id: string) => void;
    onReorder: (updateData: { id: string; position: number }[]) => void;
}

export const ChaptersList = ({ items, onEdit, onReorder }: ChaptersListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setChapters(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const items = Array.from(chapters);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updateData = items.slice(startIndex, endIndex + 1).map((chapter) => ({
            id: chapter.id,
            position: items.findIndex((item) => item.id === chapter.id)
        }));

        setChapters(items);
        onReorder(updateData);
    };

    if (!isMounted) {
        return null;
    }
    
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {chapters.map((chapter, index) => (
                            <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                                {(provided) => (
                                    <div
                                        {...provided.draggableProps}
                                        ref={provided.innerRef}
                                        className={cn(
                                            "flex items-center gap-x-2 bg-slate-200 border border-slate-200 text-slate-700 rounded-md mb-4 text-sm",
                                            chapter.isPublished && "bg-sky-100 border-sky-300 text-sky-700",
                                        )}
                                    >   
                                        <div 
                                            {...provided.dragHandleProps} 
                                            className={cn(
                                                "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                                chapter.isPublished && "border-r-sky-200 hover:bg-sky-200",
                                            )}
                                        >
                                            <Grip 
                                                className="h-5 w-5"
                                            />
                                        </div>
                                        
                                        <span className="flex-1">
                                            {chapter.title}
                                        </span>
                                        
                                        <div className="pr-2 flex items-center gap-x-2">
                                            {chapter.isFree && (
                                                <Badge>
                                                    Free
                                                </Badge>
                                            )}
                                            <Badge
                                                className={cn(
                                                    "bg-slate-500",
                                                    chapter.isPublished && "bg-sky-700"
                                                )}
                                            >
                                                {chapter.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                            <Pencil 
                                                className="h-4 w-4 cursor-pointer hover:opacity-80 transition"
                                                onClick={() => onEdit(chapter.id)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}