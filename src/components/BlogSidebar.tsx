import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface RecentPost {
  id: string;
  title: string;
  date: string;
  image: string;
}

const BlogSidebar = () => {
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "business", count: 37 },
    { name: "website", count: 10 },
    { name: "Modern technology", count: 3 },
    { name: "Product", count: 11 },
    { name: "Inspiration", count: 21 },
    { name: "template", count: 9 },
  ];

  const recentPosts: RecentPost[] = [
    {
      id: "1",
      title: "From life was you fish...",
      date: "January 12, 2025",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&auto=format",
    },
    {
      id: "2",
      title: "The Amazing Hubble",
      date: "January 10, 2025",
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=100&auto=format",
    },
    {
      id: "3",
      title: "Astronomy Or Astrology",
      date: "January 8, 2025",
      image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=100&auto=format",
    },
  ];

  const instagramImages = [
    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&auto=format",
    "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=200&auto=format",
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=200&auto=format",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&auto=format",
    "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=200&auto=format",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribe email:", email);
    setEmail("");
  };

  return (
    <aside className="space-y-8">
      {/* Search */}
      <div className="bg-muted p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 text-foreground">Search</h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search Keyword"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" className="gradient-primary">
            <Search className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* Category */}
      <div className="bg-muted p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 text-foreground">Category</h3>
        <ul className="space-y-3">
          {categories.map((category, index) => (
            <li key={index}>
              <button className="w-full text-left flex justify-between items-center text-foreground hover:text-primary transition-colors">
                <span>{category.name}</span>
                <span className="text-muted-foreground">({category.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Post */}
      <div className="bg-muted p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 text-foreground">Recent Post</h3>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <div key={post.id} className="flex gap-3 group cursor-pointer">
              <img
                src={post.image}
                alt={post.title}
                className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform"
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instagram Feeds */}
      <div className="bg-muted p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 text-foreground">Instagram Feeds</h3>
        <div className="grid grid-cols-3 gap-2">
          {instagramImages.map((image, index) => (
            <div key={index} className="aspect-square overflow-hidden rounded-lg">
              <img
                src={image}
                alt={`Instagram feed ${index + 1}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-muted p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 text-foreground">Newsletter</h3>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Subscribe
          </Button>
        </form>
      </div>
    </aside>
  );
};

export default BlogSidebar;
