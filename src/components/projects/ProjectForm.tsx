import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useProjects } from "@/hooks/use-projects";
import { cn } from "@/lib/utils";

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(3, "Navnet skal være mindst 3 tegn"),
  project_id: z.string().min(1, "Projekt ID er påkrævet"),
  type: z.string().min(1, "Type er påkrævet"),
  category: z.string().min(1, "Kategori er påkrævet"),
  status: z.string().min(1, "Status er påkrævet"),
  progress: z.coerce.number().min(0).max(100),
  priority: z.string().min(1, "Prioritet er påkrævet"),
  description: z.string().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
});

export type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  initialData?: Partial<ProjectFormValues>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ProjectForm = ({ initialData, onSuccess, onCancel }: ProjectFormProps) => {
  const { handleCreateProject, handleUpdateProject } = useProjects();
  const isEditing = !!initialData;

  // Convert string dates to Date objects for the form
  const parsedInitialData = initialData ? {
    ...initialData,
    start_date: initialData.start_date ? new Date(initialData.start_date) : undefined,
    end_date: initialData.end_date ? new Date(initialData.end_date) : undefined,
  } : undefined;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: parsedInitialData || {
      name: "",
      project_id: "",
      type: "",
      category: "bolig",
      status: "aktiv",
      progress: 0,
      priority: "green",
      description: "",
    }
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      // Format dates to ISO strings for API submission
      const formattedData = {
        ...data,
        progress: Number(data.progress),
        start_date: data.start_date ? data.start_date.toISOString().split('T')[0] : undefined,
        end_date: data.end_date ? data.end_date.toISOString().split('T')[0] : undefined,
      };

      if (isEditing && initialData?.project_id) {
        await handleUpdateProject(initialData.project_id, formattedData);
        toast.success("Projektet blev opdateret");
      } else {
        await handleCreateProject(formattedData);
        toast.success("Nyt projekt oprettet");
      }
      
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Der opstod en fejl. Prøv igen.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Projektnavn</FormLabel>
                <FormControl>
                  <Input placeholder="Angiv projektnavn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Projekt ID</FormLabel>
                <FormControl>
                  <Input placeholder="F.eks. P-123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input placeholder="F.eks. Nybyggeri - Villa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Vælg kategori" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bolig">Bolig</SelectItem>
                    <SelectItem value="erhverv">Erhverv</SelectItem>
                    <SelectItem value="institution">Institution</SelectItem>
                    <SelectItem value="renovering">Renovering</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Vælg status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="aktiv">Aktiv</SelectItem>
                    <SelectItem value="problem">Problem</SelectItem>
                    <SelectItem value="udfordring">Udfordring</SelectItem>
                    <SelectItem value="afsluttet">Afsluttet</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioritet</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Vælg prioritet" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="green">Normal</SelectItem>
                    <SelectItem value="yellow">Medium</SelectItem>
                    <SelectItem value="red">Høj</SelectItem>
                    <SelectItem value="grey">Lav</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="progress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fremgang (%)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Startdato</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Vælg dato</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Slutdato</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Vælg dato</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01") || 
                        (form.getValues("start_date") && date < form.getValues("start_date"))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beskrivelse</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Beskriv projektet..." 
                  className="h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Annuller
            </Button>
          )}
          <Button type="submit">
            {isEditing ? "Opdater projekt" : "Opret projekt"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
