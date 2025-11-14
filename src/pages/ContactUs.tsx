import { useState } from "react";
import { Mail, HeadphonesIcon, Briefcase, FileText, MapPin, Globe } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ContactCard from "@/components/ContactCard";
import SocialIcons from "@/components/SocialIcons";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ContactUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formElement = e.target as HTMLFormElement;
    const formDataObj = new FormData(formElement);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Thanks! Your message has been sent successfully.",
          description: "We'll get back to you as soon as possible.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast({
          title: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const contactOptions = [
    {
      icon: <Mail className="w-6 h-6 text-white" />,
      title: "General Inquiries",
      description: "For general questions and information about Vertexly",
      email: "contact@vertexly.com",
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6 text-white" />,
      title: "Technical Support",
      description: "Need help with your templates or technical issues?",
      email: "support@vertexly.com",
    },
    {
      icon: <Briefcase className="w-6 h-6 text-white" />,
      title: "Partnerships & Business",
      description: "Interested in collaboration or business opportunities?",
      email: "business@vertexly.com",
    },
    {
      icon: <FileText className="w-6 h-6 text-white" />,
      title: "Media & Press",
      description: "Press inquiries and media relations",
      email: "press@vertexly.com",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Contact Us" breadcrumb="Home / Contact" />

      <main className="container mx-auto px-4 py-16">
        {/* Intro Section */}
        <section className="text-center mb-16 animate-fade-in">
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you — get in touch with the Vertexly team.
          </p>
        </section>

        {/* Quick Contact Options */}
        <section className="mb-20 animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#6a5ae0] via-[#b255f1] to-[#ff7fb1] bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {contactOptions.map((option) => (
              <ContactCard key={option.title} {...option} />
            ))}
          </div>
        </section>

        {/* Office Locations */}
        <section className="mb-20 animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#6a5ae0] via-[#b255f1] to-[#ff7fb1] bg-clip-text text-transparent">
            Our Offices
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">India (Main Office)</h3>
                <p className="text-muted-foreground">
                  Lucknow, Uttar Pradesh<br />
                  India
                </p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Remote Team</h3>
                <p className="text-muted-foreground">
                  We collaborate globally with<br />
                  creators and businesses.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Social Media */}
        <section className="mb-20 animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#6a5ae0] via-[#b255f1] to-[#ff7fb1] bg-clip-text text-transparent">
            Connect With Us
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Follow us on social media for updates and inspiration
          </p>
          <SocialIcons />
        </section>

        {/* Contact Form */}
        <section className="max-w-2xl mx-auto animate-fade-in">
          <Card className="border-2">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-2">Send Us a Message</h2>
              <p className="text-center text-muted-foreground mb-8">
                Fill out the form below and we'll get back to you shortly
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="access_key" value="9ddfb1d7-29ad-4a2b-9524-bc5b07988c90" />
                <input type="hidden" name="from_name" value="Vertexly Contact Form" />
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    name="message"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="min-h-32 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 gradient-cta text-white font-semibold text-base hover:opacity-90 hover:scale-[1.02] transition-all duration-300"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
