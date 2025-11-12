import { Instagram, Linkedin, Youtube, Twitter } from "lucide-react";

const SocialIcons = () => {
  const socialLinks = [
    { icon: Instagram, label: "Instagram", url: "https://instagram.com" },
    { icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com" },
    { icon: Youtube, label: "YouTube", url: "https://youtube.com" },
    { icon: Twitter, label: "Twitter", url: "https://twitter.com" },
  ];

  return (
    <div className="flex justify-center gap-4 flex-wrap">
      {socialLinks.map(({ icon: Icon, label, url }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full border-2 border-input flex items-center justify-center hover:scale-110 hover:border-primary transition-all duration-300 group"
          aria-label={label}
        >
          <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
