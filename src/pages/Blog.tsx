import { useState } from "react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import BlogCard from "@/components/BlogCard";
import BlogSidebar from "@/components/BlogSidebar";
import Pagination from "@/components/Pagination";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";

interface BlogPost {
  id: string;
  date: string;
  month: string;
  title: string;
  excerpt: string;
  categories: string[];
  comments: number;
}

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      date: "15",
      month: "Jan",
      title: "Google inks pact for new 35-storey office",
      excerpt: "That dominion stars lights dominion divide years for fourth have don't stars is that he earth it first without heaven in place seed it second morning saying.",
      categories: ["Travel", "Lifestyle"],
      comments: 3,
    },
    {
      id: "2",
      date: "13",
      month: "Jan",
      title: "What audiences want from podcasts in 2025",
      excerpt: "That dominion stars lights dominion divide years for fourth have don't stars is that he earth it first without heaven in place seed it second morning saying.",
      categories: ["Technology", "Business"],
      comments: 5,
    },
    {
      id: "3",
      date: "12",
      month: "Jan",
      title: "How to create stunning website designs",
      excerpt: "That dominion stars lights dominion divide years for fourth have don't stars is that he earth it first without heaven in place seed it second morning saying.",
      categories: ["Design", "Tutorial"],
      comments: 8,
    },
    {
      id: "4",
      date: "10",
      month: "Jan",
      title: "The future of web development trends",
      excerpt: "That dominion stars lights dominion divide years for fourth have don't stars is that he earth it first without heaven in place seed it second morning saying.",
      categories: ["Development", "Technology"],
      comments: 12,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeader title="Company insights" breadcrumb="Home | Blog" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Blog Posts */}
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
          
          {/* Sidebar */}
          <BlogSidebar />
        </div>
      </div>
      
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Blog;
