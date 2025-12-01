export interface Template {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  rating: number;
  reviews: number;
  price: number;
  previewUrl: string;
  downloadUrl: string;
}

export const templates: Template[] = [
  {
    id: "zay",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format",
    category: "E-commerce",
    title: "Zay Ecommerce",
    description: "A modern, fully responsive e-commerce template with product showcases, shopping cart, and clean layouts.",
    rating: 4.9,
    reviews: 312,
    price: 5000,
    previewUrl: "/templates/zay/index.html",
    downloadUrl: "",
  },
  {
    id: "motora",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&auto=format",
    category: "Automotive",
    title: "Motora Car Service",
    description: "Professional car service and automotive business template with service listings, contact forms, and clean UI.",
    rating: 4.8,
    reviews: 267,
    price: 6000,
    previewUrl: "/templates/motora/index.html",
    downloadUrl: "",
  },
  {
    id: "famms",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500&auto=format",
    category: "Fashion & Retail",
    title: "Famms Fashion Store",
    description: "Stylish fashion e-commerce template with elegant product displays, testimonials, and modern design perfect for clothing stores.",
    rating: 4.7,
    reviews: 189,
    price: 6500,
    previewUrl: "/templates/famms/index.html",
    downloadUrl: "",
  },
  {
    id: "podtalk",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&auto=format",
    category: "Media & Podcast",
    title: "Pod Talk Podcast",
    description: "Modern podcast template with audio player integration, episode listings, and beautiful wave animations for content creators.",
    rating: 4.8,
    reviews: 234,
    price: 7000,
    previewUrl: "/templates/podtalk/index.html",
    downloadUrl: "",
  },
  {
    id: "glossytouch",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format",
    category: "Creative Portfolio",
    title: "Glossy Touch Portfolio",
    description: "Eye-catching portfolio template with smooth animations, modern design, and perfect showcase for creative professionals.",
    rating: 4.9,
    reviews: 276,
    price: 7500,
    previewUrl: "/templates/glossytouch/index.html",
    downloadUrl: "",
  },
  {
    id: "urotaxi",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&auto=format",
    category: "Transportation",
    title: "UroTaxi Service",
    description: "Professional taxi and transportation service template with booking features, service highlights, and clean modern interface.",
    rating: 4.6,
    reviews: 198,
    price: 8000,
    previewUrl: "/templates/urotaxi/index.html",
    downloadUrl: "",
  },
];
