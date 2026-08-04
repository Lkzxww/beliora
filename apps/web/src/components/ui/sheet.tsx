"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SheetSide = "top" | "right" | "bottom" | "left";

const sheetSideClassName: Record<SheetSide, string> = {
  top: "inset-x-0 top-0 border-b data-open:slide-in-from-top data-closed:slide-out-to-top",
  right:
    "inset-y-0 right-0 h-full w-full border-l data-open:slide-in-from-right data-closed:slide-out-to-right sm:max-w-md",
  bottom:
    "inset-x-0 bottom-0 border-t data-open:slide-in-from-bottom data-closed:slide-out-to-bottom",
  left: "inset-y-0 left-0 h-full w-full border-r data-open:slide-in-from-left data-closed:slide-out-to-left sm:max-w-md",
};

function Sheet({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-[#181615]/30 backdrop-blur-[2px] duration-200 data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  children,
  className,
  showCloseButton = true,
  side = "right",
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
  side?: SheetSide;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Popup
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-popover text-sm text-popover-foreground shadow-[0_24px_70px_rgba(24,22,21,0.22)] ring-1 ring-foreground/10 duration-200 outline-none data-closed:animate-out data-open:animate-in",
          sheetSideClassName[side],
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-4 right-4 rounded-xl text-[#74675d] hover:bg-[#f4eadc] hover:text-[#211b18] dark:text-muted-foreground dark:hover:bg-white/10 dark:hover:text-foreground"
                size="icon-sm"
              />
            }
          >
            <XIcon aria-hidden="true" />
            <span className="sr-only">Fechar</span>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Popup>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-heading text-lg font-semibold leading-none", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm leading-6 text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
