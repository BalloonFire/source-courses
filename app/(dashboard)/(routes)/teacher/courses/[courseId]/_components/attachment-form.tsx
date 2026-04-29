"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
};

const formSchema = z.object({
    url: z.string().min(1),
});

export const AttachmentForm = ({ 
    initialData, 
    courseId 
}: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleEditing = () => setIsEditing((current) => !current);
    
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Attachment added");
            toggleEditing();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    };

    const onDelete = async (attachmentId: string) => {
        try {
            setDeletingId(attachmentId);
            await axios.delete(`/api/courses/${courseId}/attachments/${attachmentId}`);
            toast.success("Attachment deleted");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Attachments
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add A File
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            No attachments yet
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attachment) => (
                        <div
                            key={attachment.id}
                            className="flex items-center p-3 w-full bg-sky-100
                            border-sky-200 border text-sky-700 rounded-md"
                        >
                            <File className="h-4 w-4 mr-2 shrink-0"/>
                            <p className="text-xs line-clamp-1">
                                {attachment.filename}
                            </p>
                            {deletingId === attachment.id && (
                                <div>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            )}
                            {deletingId !== attachment.id && (
                                <button onClick={() => onDelete(attachment.id)} className="ml-auto hover: opacity-75 transition">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        ))}
                        </div>
                    )}
                </>
            )} 
            {isEditing && (
            <div>
                <FileUpload
                    endpoint="courseAttachment"
                    onChange={(url) => {
                        if (url) {
                            onSubmit({ url: url });
                        }
                    }}
                />
                <div className="text-xs text-muted-foreground mt-4">
                    Add files like PDFs, images, or any relevant materials to provide students with additional resources to support their learning experience.
                </div>
            </div>
            )}
        </div>
     )
}