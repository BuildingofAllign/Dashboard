
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Customer, CustomerRole, PaymentTerms } from "@/hooks/customers-types";
import { X } from "lucide-react";

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: Customer;
  onSubmit: (data: any) => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Firmanavn skal være mindst 2 tegn"),
  cvr: z.string().length(8, "CVR-nummer skal være 8 cifre"),
  address: z.string().min(5, "Adresse skal være mindst 5 tegn"),
  role: z.string().min(1, "Vælg en rolle"),
  invoiceEmail: z.string().email("Indtast en gyldig e-mail"),
  paymentTerms: z.string().min(1, "Vælg betalingsbetingelser"),
  contactPersons: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Navn skal være mindst 2 tegn"),
    email: z.string().email("Indtast en gyldig e-mail"),
    phone: z.string().min(8, "Telefonnummer skal være mindst 8 cifre"),
    position: z.string().optional(),
  })).min(1, "Tilføj mindst én kontaktperson"),
});

const defaultValues = {
  name: "",
  cvr: "",
  address: "",
  role: "",
  invoiceEmail: "",
  paymentTerms: "",
  contactPersons: [
    {
      name: "",
      email: "",
      phone: "",
      position: "",
    },
  ],
};

const customerRoles: CustomerRole[] = [
  "bygherre",
  "hovedentreprenør",
  "underentreprenør",
  "leverandør",
  "rådgiver",
  "andet",
];

const paymentTermsOptions: PaymentTerms[] = [
  "8 dage",
  "14 dage",
  "30 dage",
  "løbende måned + 15 dage",
  "løbende måned + 30 dage",
];

export const CustomerFormDialog: React.FC<CustomerFormDialogProps> = ({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || defaultValues,
  });

  const addContactPerson = () => {
    const currentPersons = form.getValues("contactPersons");
    form.setValue("contactPersons", [
      ...currentPersons,
      { name: "", email: "", phone: "", position: "" },
    ]);
  };

  const removeContactPerson = (index: number) => {
    const currentPersons = form.getValues("contactPersons");
    if (currentPersons.length > 1) {
      form.setValue(
        "contactPersons",
        currentPersons.filter((_, i) => i !== index)
      );
    }
  };

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Opret ny kunde" : "Rediger kunde"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Udfyld informationen for at oprette en ny kunde"
              : "Rediger information for kunden"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firmanavn</FormLabel>
                    <FormControl>
                      <Input placeholder="Indtast firmanavn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVR-nummer</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Indtast kundens adresse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rolle i projektet</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vælg kundens rolle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customerRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Betalingsbetingelser</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vælg betalingsbetingelser" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentTermsOptions.map((term) => (
                          <SelectItem key={term} value={term}>
                            {term}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="invoiceEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faktura e-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="faktura@firma.dk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Kontaktpersoner</h3>
                <Button type="button" onClick={addContactPerson} variant="outline" size="sm">
                  Tilføj kontaktperson
                </Button>
              </div>

              {form.watch("contactPersons").map((_, index) => (
                <div key={index} className="border rounded-md p-4 space-y-4 relative">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeContactPerson(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`contactPersons.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Navn</FormLabel>
                          <FormControl>
                            <Input placeholder="Indtast navn" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`contactPersons.${index}.position`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stilling (valgfri)</FormLabel>
                          <FormControl>
                            <Input placeholder="f.eks. Projektleder" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`contactPersons.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@firma.dk" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`contactPersons.${index}.phone`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon</FormLabel>
                          <FormControl>
                            <Input placeholder="12345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="submit">
                {mode === "create" ? "Opret kunde" : "Gem ændringer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
