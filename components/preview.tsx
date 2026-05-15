"use client";

interface PreviewProps {
    value: string;
}

export const Preview = ({ value }: PreviewProps) => {
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div
                className="prose prose-sm max-w-none dark:prose-invert prose-ul:list-outside prose-ol:list-outside"
                dangerouslySetInnerHTML={{ __html: value || "<p>No content</p>" }}
            />
        </div>
    );
};
