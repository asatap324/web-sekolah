import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex h-screen items-center border-x">
        <div>
          <div className="absolute inset-x-0 h-px bg-border" />
          <Empty>
            <EmptyHeader>
              <EmptyTitle className="font-black font-mono text-8xl">
                404
              </EmptyTitle>
              <EmptyDescription className="text-nowrap">
                Halaman yang Anda cari mungkin telah <br /> dipindahkan atau
                tidak ada.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button render={<Link href="/" />}>
                  <Home /> Go Home
                </Button>

                <Button variant="outline" render={<Link href="/articles" />}>
                  <Compass /> Explore
                </Button>
              </div>
            </EmptyContent>
          </Empty>
          <div className="absolute inset-x-0 h-px bg-border" />
        </div>
      </div>
    </div>
  );
}
