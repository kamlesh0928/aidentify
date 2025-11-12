import * as RadixTooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

export function Tooltip({ children, content, side = "top" }: {
    children: ReactNode;
    content: ReactNode;
    side?: "top" | "right" | "bottom" | "left";
}) {
    return (
        <RadixTooltip.Provider>
            <RadixTooltip.Root>
                <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
                <RadixTooltip.Portal>
                    <RadixTooltip.Content
                        side={side}
                        className="z-50 rounded-md bg-sidebar-foreground/90 px-2 py-1 text-xs text-sidebar-background shadow-md"
                    >
                        {content}
                        <RadixTooltip.Arrow className="fill-sidebar-foreground/90" />
                    </RadixTooltip.Content>
                </RadixTooltip.Portal>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    );
}

export const TooltipTrigger = RadixTooltip.Trigger;
export const TooltipContent = RadixTooltip.Content;