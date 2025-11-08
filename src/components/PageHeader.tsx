interface PageHeaderProps {
  title: string;
  breadcrumb: string;
}

const PageHeader = ({ title, breadcrumb }: PageHeaderProps) => {
  return (
    <header className="gradient-primary py-20 px-4 animate-fade-in">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-white/80 text-lg">
          {breadcrumb}
        </p>
      </div>
    </header>
  );
};

export default PageHeader;
