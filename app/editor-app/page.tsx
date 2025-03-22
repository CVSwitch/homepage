import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-row mt-20">
      <Button asChild className="mx-auto flex w-fit gap-2">
        <Link href="/editor-app/editor">
          <PlusSquare className="size-5" />
          New Resume
        </Link>
      </Button>
      <Button asChild className="mx-auto flex w-fit gap-2">
        <Link href="/editor-app/import">
          <PlusSquare className="size-5" />
          Import
        </Link>
      </Button>
    </div>
  );
}
