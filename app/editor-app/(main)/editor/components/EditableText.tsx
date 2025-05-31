import { memo, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";

interface EditableTextProps {
    value: string;
    onEdit: (newValue: string) => void;
    className?: string;
    isRichText?: boolean;
}

const EditableText = memo(function EditableText({ value, onEdit, className, isRichText = false }: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const inputRef = useRef<HTMLSpanElement>(null);
    const cursorPositionRef = useRef<number | null>(null);

    const handleClick = () => {
        setIsEditing(true);
        setEditValue(value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (editValue !== value) {
            onEdit(editValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleBlur();
        }
    };

    // Update editValue when value prop changes
    useEffect(() => {
        setEditValue(value);
    }, [value]);

    // Focus and place cursor at end when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            const range = document.createRange();
            const selection = window.getSelection();
            // Place cursor at the end of the text
            range.selectNodeContents(inputRef.current);
            range.collapse(false); // false means collapse to end
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }, [isEditing]);

    const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            cursorPositionRef.current = range.startOffset;
        }
        const newValue = e.currentTarget.textContent || '';
        setEditValue(newValue);
        // Restore cursor position after state update
        requestAnimationFrame(() => {
            if (inputRef.current && cursorPositionRef.current !== null) {
                const range = document.createRange();
                const selection = window.getSelection();
                try {
                    range.setStart(inputRef.current.firstChild || inputRef.current, Math.min(cursorPositionRef.current, newValue.length));
                    range.collapse(true);
                    if (selection) {
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                } catch {
                    // If setting range fails, place cursor at end
                    range.selectNodeContents(inputRef.current);
                    range.collapse(false);
                    if (selection) {
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            }
        });
    };

    if (isEditing) {
        return (
            <span
                ref={inputRef}
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                className={cn(
                    "outline-none min-w-[1em] inline-block",
                    className
                )}
            >
                {editValue}
            </span>
        );
    }

    if (isRichText) {
        return (
            <div
                onClick={handleClick}
                className={cn("cursor-auto", className)}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
            />
        );
    }

    return (
        <span
            onClick={handleClick}
            className={cn("cursor-auto", className)}
        >
            {value}
        </span>
    );
});

export default EditableText; 