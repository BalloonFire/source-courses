"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
    Highlighter,
    Link as LinkIcon,
    Eraser,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const TiptapEditor = ({
    value,
    onChange,
    placeholder = "Write your description here...",
    disabled = false,
}: TiptapEditorProps) => {
    const [linkUrl, setLinkUrl] = useState("");
    const [showLinkInput, setShowLinkInput] = useState(false);

    const [, setRefresh] = useState(0);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                paragraph: {
                    HTMLAttributes: {
                        class: "text-base leading-6",
                    },
                },
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc list-outside ml-6",
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal list-outside ml-6",
                    },
                },
                listItem: {
                    HTMLAttributes: {
                        class: "list-item",
                    },
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Highlight.configure({
                multicolor: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-600 underline cursor-pointer",
                },
            }),
        ],
        content: value || "",
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm focus:outline-none min-h-[200px] p-4 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    disabled && "opacity-50 cursor-not-allowed"
                ),
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    // Sync external value changes to editor
    useEffect(() => {
        if (!editor) return;

        const update = () => setRefresh((v) => v + 1);

        editor.on("selectionUpdate", update);
        editor.on("transaction", update);

        return () => {
            editor.off("selectionUpdate", update);
            editor.off("transaction", update);
        };
    }, [editor]);

    const handleAddLink = () => {
        if (!linkUrl) return;
        editor
            ?.chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: linkUrl })
            .run();
        setLinkUrl("");
        setShowLinkInput(false);
    };

    const handleRemoveLink = () => {
        editor?.chain().focus().unsetLink().run();
    };

    if (!editor) {
        return null;
    }

    const getTextStyleLabel = () => {
        if (editor?.isActive("heading", { level: 1 })) return "Heading 1";
        if (editor?.isActive("heading", { level: 2 })) return "Heading 2";
        if (editor?.isActive("heading", { level: 3 })) return "Heading 3";
        return "Normal";
    };

    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="flex flex-wrap gap-2 bg-slate-100 border-b p-3">
                {/* Text Style Dropdown */}
                <div className="flex gap-1 border-r pr-2">
                    <select
                        value={
                            editor.isActive("heading", { level: 1 })
                                ? "h1"
                                : editor.isActive("heading", { level: 2 })
                                  ? "h2"
                                  : editor.isActive("heading", { level: 3 })
                                    ? "h3"
                                    : "normal"
                        }
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "normal") {
                                editor.chain().focus().setParagraph().run();
                            } else if (value === "h1") {
                                editor.chain().focus().setHeading({ level: 1 }).run();
                            } else if (value === "h2") {
                                editor.chain().focus().setHeading({ level: 2 }).run();
                            } else if (value === "h3") {
                                editor.chain().focus().setHeading({ level: 3 }).run();
                            }
                        }}
                        disabled={disabled}
                        className="px-2 py-1 border border-gray-300 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="normal">Normal</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                    </select>
                </div>

                {/* Text Format Controls */}
                <div className="flex gap-1 border-r pr-2">
                    <ToolButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive("bold")}
                        disabled={disabled}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="h-4 w-4" />
                    </ToolButton>
                    <ToolButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive("italic")}
                        disabled={disabled}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="h-4 w-4" />
                    </ToolButton>
                    <ToolButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive("underline")}
                        disabled={disabled}
                        title="Underline (Ctrl+U)"
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </ToolButton>
                </div>

                {/* List Controls */}
                <div className="flex gap-1 border-r pr-2">
                    <ToolButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive("bulletList")}
                        disabled={disabled}
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </ToolButton>
                    <ToolButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive("orderedList")}
                        disabled={disabled}
                        title="Ordered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </ToolButton>
                </div>

                {/* Alignment Controls */}
                <div className="flex gap-1 border-r pr-2">
                    <ToolButton
                        onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        isActive={editor.isActive({ textAlign: "left" })}
                        disabled={disabled}
                        title="Align Left"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </ToolButton>
                    <ToolButton
                        onClick={() => editor.chain().focus().setTextAlign("center").run()}
                        isActive={editor.isActive({ textAlign: "center" })}
                        disabled={disabled}
                        title="Align Center"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </ToolButton>
                    <ToolButton
                        onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        isActive={editor.isActive({ textAlign: "right" })}
                        disabled={disabled}
                        title="Align Right"
                    >
                        <AlignRight className="h-4 w-4" />
                    </ToolButton>
                </div>

                {/* Link Controls */}
                <div className="flex gap-1 border-r pr-2">
                    <ToolButton
                        onClick={() => setShowLinkInput(!showLinkInput)}
                        isActive={editor.isActive("link")}
                        disabled={disabled}
                        title="Add Link"
                    >
                        <LinkIcon className="h-4 w-4" />
                    </ToolButton>
                </div>

                {/* Highlight Control */}
                <div className="flex gap-1 border-r pr-2">
                    <ToolButton
                        onClick={() =>
                            editor.chain().focus().toggleHighlight({ color: "#FFC078" }).run()
                        }
                        isActive={editor.isActive("highlight")}
                        disabled={disabled}
                        title="Highlight"
                    >
                        <Highlighter className="h-4 w-4" />
                    </ToolButton>
                </div>

                {/* Clear Formatting */}
                <div className="flex gap-1">
                    <ToolButton
                        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                        disabled={disabled}
                        isActive={false}
                        title="Clear Formatting"
                    >
                        <Eraser className="h-4 w-4" />
                    </ToolButton>
                </div>
            </div>

            {/* Link Input */}
            {showLinkInput && (
                <div className="bg-slate-50 border-b p-3 flex gap-2">
                    <input
                        type="url"
                        placeholder="Enter URL..."
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleAddLink();
                            } else if (e.key === "Escape") {
                                setShowLinkInput(false);
                            }
                        }}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={handleAddLink}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                        Add
                    </button>
                    {editor.isActive("link") && (
                        <button
                            type="button"
                            onClick={handleRemoveLink}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                        >
                            Remove
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setShowLinkInput(false)}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            )}

            <EditorContent
                editor={editor}
                className={cn(disabled && "opacity-50 cursor-not-allowed pointer-events-none")}
            />
        </div>
    );
};

interface ToolButtonProps {
    onClick: () => void;
    isActive: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}

const ToolButton = ({
    onClick,
    isActive,
    disabled,
    title,
    children,
}: ToolButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
            "p-1 rounded hover:bg-slate-200 transition-colors",
            isActive && "bg-slate-200",
            disabled && "opacity-50 cursor-not-allowed"
        )}
    >
        {children}
    </button>
);
