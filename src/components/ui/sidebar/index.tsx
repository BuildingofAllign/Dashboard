
import { TooltipProvider } from "@/components/ui/tooltip"

export { SidebarProvider, useSidebar } from "./context"
export { Sidebar } from "./sidebar"
export { 
  SidebarTrigger, 
  SidebarRail 
} from "./trigger"
export {
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent
} from "./layout"
export {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent
} from "./group"
export {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton
} from "./menu"
export {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "./submenu"

// Re-export TooltipProvider so consumers don't have to import it separately
export { TooltipProvider }
