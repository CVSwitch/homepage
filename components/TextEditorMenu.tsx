import { Editor } from "@tiptap/react";
import { Bold, Underline, Italic, List, ListOrdered } from "lucide-react";

const Button = ({
  onClick,
  isActive,
  disabled,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`p-2 ${isActive ? "bg-black text-white rounded-md" : ""}`}
  >
    {children}
  </button>
);

export default function TextEditorMenuBar({
  editor,
}: {
  editor: Editor | null;
}) {
  if (!editor) return null;
  const buttons = [
    {
      icon: <Bold className="size-5" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-5" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      disabled: !editor.can().chain().focus().toggleItalic().run(),
    },
    {
      icon: <Underline className="size-5" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
    },
    {
      icon: <List className="size-5" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-5" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
    },
  ];

  return (
    <div className="mb-2 flex space-x-2  border rounded-md">
      {buttons.map(({ icon, onClick, isActive }, index) => (
        <Button
          key={index}
          onClick={onClick}
          isActive={isActive}
        >
          {icon}
        </Button>
      ))}
    </div>
  );
}
