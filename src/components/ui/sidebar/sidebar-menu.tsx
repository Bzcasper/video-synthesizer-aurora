
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuItem.displayName = "SidebarMenuItem"

export const SidebarMenuButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    icon?: React.ReactNode
    isActive?: boolean
    isCollapsible?: boolean
    isCollapsed?: boolean
  }
>(
  (
    {
      asChild = false,
      icon,
      isActive,
      isCollapsible,
      isCollapsed,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "a"

    return (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-active={isActive}
        data-collapsible={isCollapsible}
        data-collapsed={isCollapsed}
        className={cn(
          "group/link relative flex h-9 min-w-0 items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground outline-none transition-colors duration-golden hover:bg-aurora-blue/10 hover:text-aurora-blue hover:shadow-neon-blue focus-visible:ring-2 focus-visible:ring-aurora-blue disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:first-child]:shrink-0 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-foreground",
          "data-[active=true]:bg-aurora-blue/20 data-[active=true]:text-aurora-blue data-[active=true]:shadow-neon-blue",
          "data-[collapsible=true]:after:absolute data-[collapsible=true]:after:right-3 data-[collapsible=true]:after:top-1/2 data-[collapsible=true]:after:-translate-y-1/2 data-[collapsible=true]:data-[collapsed=false]:after:rotate-90",
          "group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:after:hidden group-data-[collapsible=icon]:[&>span:last-child]:scale-0 group-data-[collapsible=icon]:[&>span:last-child]:opacity-0",
          className
        )}
        {...props}
      >
        {icon && <span>{icon}</span>}
        <span>{children}</span>
        {isCollapsible && (
          <ChevronRight className="ml-auto shrink-0 transition-transform group-data-[collapsible=icon]:scale-0 group-data-[collapsible=icon]:opacity-0" />
        )}
      </Comp>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarMenuAction = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button> & {
    variant?:
      | "default"
      | "ghost"
      | "destructive"
      | "outline"
      | "link"
  }
>(({ className, size = "icon", variant = "ghost", ...props }, ref) => {
  return (
    <Button
      ref={ref}
      data-sidebar="menu-action"
      variant={variant}
      size={size}
      className={cn(
        "size-7 absolute right-2 top-1/2 -translate-y-1/2 transition-all hover:bg-aurora-blue/10 hover:text-aurora-blue hover:shadow-neon-blue",
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

export const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Badge>
>(({ className, variant = "secondary", ...props }, ref) => {
  return (
    <Badge
      data-sidebar="menu-badge"
      variant={variant}
      className={cn(
        "ml-auto scale-100 opacity-100 transition-all",
        "group-data-[collapsible=icon]:scale-0 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuBadge.displayName = "SidebarMenuBadge"
