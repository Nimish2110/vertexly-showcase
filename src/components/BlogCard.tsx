import { MessageCircle } from "lucide-react";

interface BlogCardProps {
  date: string;
  month: string;
  title: string;
  excerpt: string;
  categories: string[];
  comments: number;
}

const BlogCard = ({ date, month, title, excerpt, categories, comments }: BlogCardProps) => {
  return (
    <article className="bg-card rounded-xl shadow-soft hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Date Badge */}
        <div className="bg-primary text-primary-foreground p-6 flex flex-col items-center justify-center min-w-[120px]">
          <span className="text-4xl font-bold">{date}</span>
          <span className="text-lg uppercase tracking-wide">{month}</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6">
          <h3 className="text-2xl font-bold text-foreground mb-3 hover:text-primary transition-colors cursor-pointer">
            {title}
          </h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex gap-2">
              {categories.map((category, index) => (
                <span key={index} className="text-accent hover:underline cursor-pointer">
                  {category}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{comments} Comments</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
