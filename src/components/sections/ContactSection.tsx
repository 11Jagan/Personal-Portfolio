
'use client';

import * as React from "react";
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
import { Mail, Linkedin, Github, Send, Smartphone, MapPin, Instagram } from 'lucide-react';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLoading } from '@/contexts/LoadingContext';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = () => {
  const { toast } = useToast();
  const { setIsLoading } = useLoading();
  const [isSubmittingState, setIsSubmittingState] = React.useState(false);


  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    mode: "onChange", 
  });

  const recipientEmail = "konthamjaganmohanreddy@gmail.com";
  const mailtoLinkDirect = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=Contact%20from%20Portfolio`;


  async function onSubmit(data: ContactFormValues) {
    console.log("ContactSection onSubmit: Attempting to send data to /api/contact:", data);
    setIsSubmittingState(true);
    setIsLoading(true); 

    let toastTitle = "Processing...";
    let toastDescription = "Your message is being sent.";
    let toastVariant: "default" | "destructive" = "default";

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseBodyText = await response.text(); 
      
      if (response.ok) {
        try {
            const result = JSON.parse(responseBodyText);
            console.log("ContactSection onSubmit: Success response from API:", result);
            toastTitle = "Message Sent!";
            toastDescription = result.message || "Your message has been successfully submitted and saved locally.";
            form.reset();
        } catch (e) {
            console.error("ContactSection onSubmit: API response was OK, but not valid JSON:", responseBodyText, e);
            toastTitle = "Message Sent (with warning)";
            toastDescription = "Your message was likely processed, but the server sent an unexpected confirmation. Body: " + responseBodyText.substring(0,100);
            // Still reset form as it likely succeeded server-side if response.ok
            form.reset();
        }
      } else {
        toastTitle = "Submission Error";
        toastVariant = "destructive";
        try {
          const errorResult = JSON.parse(responseBodyText);
          console.error("ContactSection onSubmit: Error response from API (JSON):", errorResult);

          if (typeof errorResult === 'object' && errorResult !== null && Object.keys(errorResult).length === 0 && errorResult.constructor === Object) {
            toastDescription = "The server returned an empty error response. This might indicate an issue with the local file storage API (e.g., permissions, file access). Please check the server console logs for more details or contact the site administrator.";
          } else {
            toastDescription = errorResult.error || errorResult.details || errorResult.message || "An unknown error occurred on the server while trying to save the message locally.";
          }
          
          if (errorResult.details && typeof errorResult.details === 'object' && !(errorResult.details.constructor === Object && Object.keys(errorResult.details).length === 0) ) {
             const errorMessages = Object.values(errorResult.details)
                .flatMap((field: any) => field._errors || (typeof field === 'string' ? [field] : [])) 
                .join(" ");
             if (errorMessages) toastDescription += ` Details: ${errorMessages}`;
          }
        } catch (e) { 
          console.error("ContactSection onSubmit: API error response (not JSON). Status:", response.status, "Body:", responseBodyText, "Parsing error:", e instanceof Error ? e.message : String(e));
          if (responseBodyText.toLowerCase().includes("<html")) {
             toastDescription = `The server's API route (/api/contact) returned an HTML error page (status ${response.status}) instead of a JSON response. This usually indicates a critical internal error within the API route itself. Please check the server-side logs for the Next.js application for more details.`;
             console.error("ContactSection onSubmit: HTML Error Page Snippet from /api/contact:", responseBodyText.substring(0, 300));
          } else {
             toastDescription = responseBodyText.trim() || `Server error: ${response.status}. Please try again. Failed to save message locally.`;
          }
        }
      }
    } catch (error: any) {
      console.error("ContactSection onSubmit: Network or unexpected error:", error);
      toastTitle = "Network Error";
      toastDescription = error.message || "Could not connect to the server. Please check your internet connection and try again.";
      toastVariant = "destructive";
    } finally {
      setIsLoading(false);
      setIsSubmittingState(false);
      toast({
        title: toastTitle,
        description: toastDescription,
        variant: toastVariant,
        duration: toastVariant === "destructive" ? 10000 : 7000,
      });
    }
  }
  
  const isButtonDisabled = form.formState.isSubmitting || isSubmittingState;

  return (
    <section id="contact" className="py-10 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-primary animate-slideUpFadeIn opacity-0" style={{animationDelay: '0ms', animationFillMode: 'forwards'}}>Get In Touch</h2>
        <p className="text-md sm:text-lg text-muted-foreground text-center mb-10 md:mb-12 max-w-xl mx-auto animate-slideUpFadeIn opacity-0" style={{animationDelay: '200ms', animationFillMode: 'forwards'}}>
          Have a project in mind, a question, or just want to say hi? Fill out the form below to send me a message.
        </p>
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 animate-slideUpFadeIn opacity-0" style={{animationDelay: '400ms', animationFillMode: 'forwards'}}>
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-xl sm:text-2xl">Send me a message</CardTitle>
                <CardDescription className="text-sm sm:text-base">Your message will be saved locally for review.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Full Name</FormLabel>
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
                            <FormLabel className="text-sm">Your Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
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
                          <FormLabel className="text-sm">Subject</FormLabel>
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
                          <FormLabel className="text-sm">Your Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Hi Jagan, I'd like to discuss..." rows={4} {...field} />
                          </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                    />
                    <Button type="submit" className={cn("w-full sm:w-auto group", "interactive-border")} disabled={isButtonDisabled}>
                      {isButtonDisabled ? 'Sending...' : 'Send Message'}
                      {!isButtonDisabled && <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6 animate-slideUpFadeIn opacity-0" style={{animationDelay: '600ms', animationFillMode: 'forwards'}}>
             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4 sm:p-6">
                    <div className="flex items-center space-x-2 sm:space-x-3 group">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:text-accent transition-colors" />
                        <a href={mailtoLinkDirect} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-foreground/80 hover:text-accent transition-colors interactive-border border-2 border-transparent rounded-md px-1 py-0.5">{recipientEmail}</a>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 group">
                        <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:text-accent transition-colors" />
                        <a href="tel:+918050453043" className="text-sm sm:text-base text-foreground/80 hover:text-accent transition-colors interactive-border border-2 border-transparent rounded-md px-1 py-0.5">
                          +91 8050453043
                        </a>
                    </div>
                     <div className="flex items-center space-x-2 sm:space-x-3 group">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:text-accent transition-colors" />
                        <span className="text-sm sm:text-base text-foreground/80 interactive-border border-2 border-transparent rounded-md px-1 py-0.5 cursor-default">India</span>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-lg group hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Connect With Me</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6">
                     <Button variant="outline" className={cn("w-full justify-start group text-sm sm:text-base", "interactive-border")} asChild>
                        <Link href="https://github.com/11Jagan" target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:text-accent transition-colors" /> GitHub
                        </Link>
                    </Button>
                     <Button variant="outline" className={cn("w-full justify-start group text-sm:text-base", "interactive-border")} asChild>
                        <Link href="https://linkedin.com/in/jagan-mohan-reddy-kontham-445250293/" target="_blank" rel="noopener noreferrer">
                            <Linkedin className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:text-accent transition-colors" /> LinkedIn
                        </Link>
                    </Button>
                    <Button variant="outline" className={cn("w-full justify-start group text-sm sm:text-base", "interactive-border")} asChild>
                        <Link href="https://www.instagram.com/11_jagan_/" target="_blank" rel="noopener noreferrer">
                            <Instagram className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:text-accent transition-colors" /> Instagram
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

