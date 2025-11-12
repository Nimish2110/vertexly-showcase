import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
        <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center transition-transform group-hover:scale-105">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-foreground">Vertexly</span>
      </Link>

      {/* Title & Subtitle */}
      <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;
