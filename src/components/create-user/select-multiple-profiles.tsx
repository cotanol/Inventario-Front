import { useFormContext } from "react-hook-form";

// --- Shadcn UI & Lucide Icon Imports ---
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import type { IPerfil } from "./user-schema";

interface UserProfileMultiSelectProps {
  perfiles: IPerfil[];
}

export const UserProfileMultiSelect = ({
  perfiles,
}: UserProfileMultiSelectProps) => {
  const form = useFormContext(); // Obtenemos el control del formulario del contexto

  return (
    <FormField
      control={form.control}
      name="perfilesIds"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Perfiles/Roles*</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between border-gray-300 rounded-md",
                    !field.value?.length && "text-muted-foreground"
                  )}
                >
                  {field.value?.length
                    ? `${field.value.length} perfiles seleccionados`
                    : "Seleccionar perfiles..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Buscar perfil..." />
                <CommandList>
                  <CommandEmpty>No se encontró el perfil.</CommandEmpty>
                  <CommandGroup>
                    {perfiles.map((perfil) => (
                      <CommandItem
                        value={perfil.nombre}
                        key={perfil.perfilId}
                        onSelect={() => {
                          const currentValues = field.value || [];
                          const selected = currentValues.includes(
                            perfil.perfilId
                          )
                            ? currentValues.filter(
                                (id: number) => id !== perfil.perfilId
                              )
                            : [...currentValues, perfil.perfilId];
                          field.onChange(selected);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            (field.value || []).includes(perfil.perfilId)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {perfil.nombre}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
