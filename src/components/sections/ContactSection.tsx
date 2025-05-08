
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
  const { setIsLoading } = useLoading(); // Use setIsLoading for managing loading state
  const [isSubmittingState, setIsSubmittingState] = React.useState(false);


  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    mode: "onChange", // Validate on change for better UX
  });

  const recipientEmail = "konthamjaganmohanreddy@gmail.com";
  const mailtoLinkDirect = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=Contact%20from%20Portfolio`;

  async function onSubmit(data: ContactFormValues) {
    console.log("ContactSection onSubmit: Preparing mailto link with data:", data);
    setIsSubmittingState(true);
    setIsLoading(true); 

    const { name, email, subject, message } = data;
    
    const mailtoBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoSubject = `Portfolio Contact: ${subject}`;
    const mailtoHref = `mailto:${recipientEmail}?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;

    try {
      // Attempt to open the mail client
      window.location.href = mailtoHref;
      
      toast({
        title: "Opening Email Client",
        description: "Please complete sending your message through your email application.",
        variant: "default", // 'default' is typically blue/neutral, not green for success.
        duration: 7000, // Increased duration
      });
      form.reset(); // Reset form fields after attempting to open mail client
    } catch (error) {
      console.error("ContactSection onSubmit: Error trying to open mailto link:", error);
      toast({
        title: "Error Opening Email Client",
        description: "Could not automatically open your email client. Please manually copy the email address and send your message.",
        variant: "destructive",
        duration: 10000, // Longer duration for error messages
      });
    } finally {
      // Give some time for the browser to process the mailto link and for the user to see the toast.
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmittingState(false);
      }, 1500); // Adjusted delay
    }
  }
  
  // Button should be disabled if the form is being submitted OR if the mailto link is being prepared.
  const isButtonDisabled = form.formState.isSubmitting || isSubmittingState;

  return (
    <section id="contact" className="py-10 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-primary animate-slideUpFadeIn opacity-0" style={{animationDelay: '0ms', animationFillMode: 'forwards'}}>Get In Touch</h2>
        <p className="text-md sm:text-lg text-muted-foreground text-center mb-10 md:mb-12 max-w-xl mx-auto animate-slideUpFadeIn opacity-0" style={{animationDelay: '200ms', animationFillMode: 'forwards'}}>
          Have a project in mind, a question, or just want to say hi? Fill out the form below. Clicking &quot;Send Message&quot; will open your default email client.
        </p>
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 animate-slideUpFadeIn opacity-0" style={{animationDelay: '400ms', animationFillMode: 'forwards'}}>
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-xl sm:text-2xl">Send me a message</CardTitle>
                <CardDescription className="text-sm sm:text-base">Your message will be prepared for your default email application.</CardDescription>
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
                            <FormLabel className="text-sm">Your Email Address (for reply)</FormLabel>
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
                      {isButtonDisabled ? 'Preparing...' : 'Send Message via Email Client'}
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
