
import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const accounts = [
  {
    label: "Allign",
    email: "m@example.com",
    icon: (
      <Avatar className="h-6 w-6">
        <AvatarImage src="/placeholder-user.jpg" alt="A" />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
    ),
  },
  {
    label: "Acme Inc.",
    email: "info@example.com",
    icon: (
      <Avatar className="h-6 w-6">
        <AvatarImage src="/placeholder-user.jpg" alt="A" />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
    ),
  },
  {
    label: "Monsters Inc.",
    email: "sales@example.com",
    icon: (
      <Avatar className="h-6 w-6">
        <AvatarImage src="/placeholder-user.jpg" alt="M" />
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
    ),
  },
]

type Account = (typeof accounts)[number]

interface AccountSwitcherProps {
  isCollapsed: boolean
}

export function AccountSwitcher({ isCollapsed }: AccountSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
  const [selectedAccount, setSelectedAccount] = React.useState<Account>(
    accounts[0]
  )

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-full justify-between", isCollapsed && "h-9 px-2")}
          >
            {isCollapsed ? (
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${selectedAccount.email}`}
                  alt={selectedAccount.label}
                />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
            ) : (
              <>
                {selectedAccount.icon}
                <span className="ml-2">{selectedAccount.label}</span>
              </>
            )}
            <ChevronsUpDown
              className={cn(
                "ml-auto h-4 w-4 shrink-0 opacity-50",
                isCollapsed && "hidden"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup>
                {accounts.map((account) => (
                  <CommandItem
                    key={account.email}
                    onSelect={() => {
                      setSelectedAccount(account)
                      setOpen(false)
                    }}
                    className="text-sm"
                  >
                    {account.icon}
                    <span className="ml-2">{account.label}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedAccount.email === account.email
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowNewTeamDialog(true)
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{" "}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{" "}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
