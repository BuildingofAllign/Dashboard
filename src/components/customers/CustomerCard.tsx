
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, Phone, Pin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Customer } from "@/hooks/customers-types";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CustomerCardProps {
  customer: Customer;
  onPinToggle: (id: string, isPinned: boolean) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onPinToggle
}) => {
  const mainContactPerson = customer.contactPersons[0];

  return (
    <Card className={cn(
      "h-full transition-all hover:shadow-md hover:translate-y-[-2px] group",
      customer.is_pinned && "border-primary/30 shadow-sm bg-primary/[0.03]"
    )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">
          {customer.name}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPinToggle(customer.id, !!customer.is_pinned)}
          aria-label={customer.is_pinned ? "Fjern fra favoritter" : "Tilføj til favoritter"}
          className="transition-all hover:bg-primary/10"
        >
          <Pin className={cn(
            "h-4 w-4 transition-all",
            customer.is_pinned ? "fill-primary text-primary" : "text-muted-foreground group-hover:text-primary/70"
          )} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">CVR:</span> {customer.cvr}
        </div>
        
        <div className="text-sm flex items-start gap-2">
          <Building2 className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{customer.address}</span>
        </div>
        
        {mainContactPerson && (
          <>
            <div className="text-sm font-medium">
              {mainContactPerson.name}
              {mainContactPerson.position && (
                <span className="font-normal text-muted-foreground ml-1">
                  ({mainContactPerson.position})
                </span>
              )}
            </div>
            
            <div className="text-sm flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{mainContactPerson.phone}</span>
            </div>
            
            <div className="text-sm flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{mainContactPerson.email}</span>
            </div>
          </>
        )}

        <div className="pt-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium capitalize transition-colors",
                customer.role === "bygherre" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                customer.role === "hovedentreprenør" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                customer.role === "underentreprenør" && "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                customer.role === "leverandør" && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
                customer.role === "rådgiver" && "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
                customer.role === "andet" && "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
              )}>
                {customer.role}
              </span>
            </div>
            <Link to={`/kunder/${customer.id}`}>
              <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">Se detaljer</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
