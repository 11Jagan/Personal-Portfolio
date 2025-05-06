'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Linkedin, Github, Send, Smartphone, MapPin } from 'lucide-react';
import Link from "next/link";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = () => {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    // Here you would typically send the data to a backend API
    // For this example, we'll just simulate a successful submission
    console.log(data);
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
      variant: "default",
    });
    form.reset();
  }

  return (
    <section id="contact" className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">Get In Touch</h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Have a project in mind, a question, or just want to say hi? Feel free to reach out. I&apos;m always open to discussing new opportunities and collaborations.
        </p>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Send me a message</CardTitle>
                <CardDescription>I&apos;ll do my best to respond within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Kontham Jagan Mohan Reddy" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="konthamjaganmohanredy@gmail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Project Inquiry" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Hi Jagan, I'd like to discuss..." rows={5} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 group" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                      {!form.formState.isSubmitting && <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="text-xl">Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <a href="mailto:konthamjaganmohanredy@gmail.com" className="text-foreground/80 hover:text-primary transition-colors">konthamjaganmohanredy@gmail.com</a>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <span className="text-foreground/80">+91 8050453043</span>
                    </div>
                     <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span className="text-foreground/80">India</span>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="text-xl">Connect With Me</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                     <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-5 w-5 text-primary" /> GitHub
                        </Link>
                    </Button>
                     <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                            <Linkedin className="mr-2 h-5 w-5 text-primary" /> LinkedIn
                        </Link>
                    </Button>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
