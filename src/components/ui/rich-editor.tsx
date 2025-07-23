import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react'

interface RichEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const RichEditor = ({
  content,
  onChange,
  placeholder = "내용을 입력하세요...",
  disabled = false,
  className
}: RichEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg'
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80'
        }
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editable: !disabled
  })

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('이미지 URL을 입력하세요:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('링크 URL을 입력하세요:', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className={cn("border border-input rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
        {/* Text formatting */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn("h-8 w-8 p-0", editor.isActive('heading', { level: 1 }) && "bg-accent")}
            disabled={disabled}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn("h-8 w-8 p-0", editor.isActive('heading', { level: 2 }) && "bg-accent")}
            disabled={disabled}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn("h-8 w-8 p-0", editor.isActive('heading', { level: 3 }) && "bg-accent")}
            disabled={disabled}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('paragraph') && "bg-accent")}
            disabled={disabled}
          >
            <Type className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Text styles */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('bold') && "bg-accent")}
            disabled={disabled}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('italic') && "bg-accent")}
            disabled={disabled}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('strike') && "bg-accent")}
            disabled={disabled}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('code') && "bg-accent")}
            disabled={disabled}
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists and quote */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('bulletList') && "bg-accent")}
            disabled={disabled}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('orderedList') && "bg-accent")}
            disabled={disabled}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('blockquote') && "bg-accent")}
            disabled={disabled}
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Media and links */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={cn("h-8 w-8 p-0", editor.isActive('link') && "bg-accent")}
            disabled={disabled}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addImage}
            className="h-8 w-8 p-0"
            disabled={disabled}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run() || disabled}
            className="h-8 w-8 p-0"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run() || disabled}
            className="h-8 w-8 p-0"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className={cn(
          "prose prose-sm max-w-none min-h-[200px] p-4 focus-within:outline-none",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{
          '--tw-prose-body': 'hsl(var(--foreground))',
          '--tw-prose-headings': 'hsl(var(--foreground))',
          '--tw-prose-links': 'hsl(var(--primary))',
          '--tw-prose-bold': 'hsl(var(--foreground))',
          '--tw-prose-code': 'hsl(var(--foreground))',
          '--tw-prose-quotes': 'hsl(var(--muted-foreground))',
          '--tw-prose-quote-borders': 'hsl(var(--border))',
          '--tw-prose-captions': 'hsl(var(--muted-foreground))',
          '--tw-prose-kbd': 'hsl(var(--foreground))',
          '--tw-prose-pre-bg': 'hsl(var(--muted))',
          '--tw-prose-th-borders': 'hsl(var(--border))',
          '--tw-prose-td-borders': 'hsl(var(--border))'
        } as React.CSSProperties}
      />

      {editor.isEmpty && (
        <div className="absolute top-[60px] left-4 pointer-events-none text-muted-foreground">
          {placeholder}
        </div>
      )}
    </div>
  )
}