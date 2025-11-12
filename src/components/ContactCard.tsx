import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ContactCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  email: string;
}

const ContactCard = ({ icon, title, description, email }: ContactCardProps) => {
  return (
    <Card className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-2 hover:border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{description}</p>
            <a 
              href={`mailto:${email}`}
              className="text-sm font-medium text-primary hover:underline transition-colors"
            >
              {email}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
