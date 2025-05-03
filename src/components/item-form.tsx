"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState, type ChangeEvent } from "react";
import Image from 'next/image';


const formSchema = z.object({
  type: z.enum(["lost", "found"], {
    required_error: "Please select if the item is lost or found.",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }).max(100, {
    message: "Title cannot exceed 100 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description cannot exceed 500 characters.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  date: z.date({
    required_error: "A date is required.",
  }),
  image: z.instanceof(File).optional(),
});

export type ItemFormValues = z.infer<typeof formSchema>;

interface ItemFormProps {
  onSubmit: (values: ItemFormValues) => Promise<void> | void;
  defaultValues?: Partial<ItemFormValues>;
  isSubmitting?: boolean;
}

export function ItemForm({ onSubmit, defaultValues, isSubmitting = false }: ItemFormProps) {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'lost', // Default to lost
      date: new Date(),
      ...defaultValues,
    },
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultValues?.image ? URL.createObjectURL(defaultValues.image) : null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue("image", undefined);
      setPreviewUrl(null);
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select if the item is lost or found" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="lost">Lost</SelectItem>
                  <SelectItem value="found">Found</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Black Wallet" {...field} />
              </FormControl>
              <FormDescription>
                A short, descriptive title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the item in detail (color, brand, distinguishing features, where it was lost/found)"
                  className="resize-none"
                  {...field}
                  rows={4}
                />
              </FormControl>
               <FormDescription>
                Provide as much detail as possible.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Central Park, near the fountain" {...field} />
              </FormControl>
              <FormDescription>
                Where was the item lost or found?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date Lost/Found</FormLabel>
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
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
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
                      date > new Date() || date < new Date("1900-01-01")
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
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image (Optional)</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                   <Button type="button" variant="outline" className="relative">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                    <Input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      onChange={handleImageChange}
                    />
                  </Button>
                  {previewUrl && (
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                       <Image src={previewUrl} alt="Preview" layout="fill" objectFit="cover" />
                    </div>
                  )}
                </div>

              </FormControl>
              <FormDescription>Upload an image of the item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
           {isSubmitting ? 'Submitting...' : 'Submit Item'}
        </Button>
      </form>
    </Form>
  );
}
