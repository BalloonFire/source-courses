"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,
    FormItem
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(1, "Course name is required")
});

const CreateCoursePage = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values);
            const courseId = response.data.id;  
            router.push(`/teacher/courses/${courseId}`);
            toast.success("Course created successfully!");
        } catch (error) {
            toast.error("Failed to create course. Please try again.");
        }
    };

    return ( 
        <div className="max-w-5xl mx-auto flex h-full md:items-center md:justify-center p-6">
            <div>
            <h1 className="text-2xl">
                Type Your Course Name
            </h1>
            <p>
                Enter the name of your new course below. You can change it later.
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Course Name</FormLabel>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder="e.g. Advanced React" {...field} />
                                </FormControl>
                                <FormDescription>
                                    What you will teach in this course.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Link href="/">
                            <Button variant="ghost" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting || !isValid}>
                            Create Course
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
        </div>
     );
}
 
export default CreateCoursePage;