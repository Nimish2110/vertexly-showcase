import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Elements = () => {
  const tableData = [
    { id: 1, country: "Canada", visits: 2563, percent: 80, color: "bg-blue-500" },
    { id: 2, country: "United States", visits: 1563, percent: 60, color: "bg-red-500" },
    { id: 3, country: "United Kingdom", visits: 2563, percent: 70, color: "bg-orange-500" },
    { id: 4, country: "Germany", visits: 2563, percent: 90, color: "bg-green-500" },
    { id: 5, country: "Australia", visits: 1563, percent: 50, color: "bg-cyan-500" },
    { id: 6, country: "China", visits: 2563, percent: 85, color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeader title="Elements" breadcrumb="Home | Elements" />

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Text Samples */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-foreground">Text Sample</h2>
          <p className="text-foreground leading-relaxed text-lg">
            Every avid <strong>independent filmmaker</strong> has <em>dreamed</em> of seeing their{" "}
            <u>work on the big screen</u>. <s>But</s> most<sup>1</sup> filmmakers<sub>indie</sub>{" "}
            never get the chance to watch their work in a theater.
          </p>
        </section>

        {/* Sample Buttons */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-foreground">Sample Buttons</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="default">Default</Button>
            <Button className="bg-[#2E2E64] hover:bg-[#2E2E64]/90">Primary</Button>
            <Button className="bg-[#2fd5c9] hover:bg-[#2fd5c9]/90">Success</Button>
            <Button className="bg-[#3ba9ff] hover:bg-[#3ba9ff]/90">Info</Button>
            <Button className="bg-[#ffdf00] hover:bg-[#ffdf00]/90 text-foreground">Warning</Button>
            <Button variant="destructive">Danger</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Button variant="outline">Default</Button>
            <Button variant="outline" className="border-[#2E2E64] text-[#2E2E64] hover:bg-[#2E2E64] hover:text-white">Primary</Button>
            <Button variant="outline" className="border-[#2fd5c9] text-[#2fd5c9] hover:bg-[#2fd5c9] hover:text-white">Success</Button>
            <Button variant="outline" className="border-[#3ba9ff] text-[#3ba9ff] hover:bg-[#3ba9ff] hover:text-white">Info</Button>
          </div>
        </section>

        {/* Image Gallery */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-foreground">Image Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-video rounded-xl overflow-hidden group">
                <img
                  src={`https://images.unsplash.com/photo-${1460925895917 + i}-afdab827c52f?w=600&auto=format`}
                  alt={`Gallery ${i}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 shadow-elegant"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Lists & Headings */}
        <section className="grid md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">Headings</h2>
            <h1 className="text-4xl font-semibold mb-2">Heading 1</h1>
            <h2 className="text-3xl font-semibold mb-2">Heading 2</h2>
            <h3 className="text-2xl font-semibold mb-2">Heading 3</h3>
            <h4 className="text-xl font-semibold mb-2">Heading 4</h4>
            <h5 className="text-lg font-semibold mb-2">Heading 5</h5>
            <h6 className="text-base font-semibold">Heading 6</h6>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">Unordered List</h2>
            <ul className="list-disc list-inside space-y-2 text-foreground marker:text-primary">
              <li>Fta Keys</li>
              <li>For Women Only Your Computer Usage</li>
              <li>
                Facts Why Inkjet Printing Is Very Appealing
                <ul className="list-circle list-inside ml-6 mt-2 space-y-1 marker:text-accent">
                  <li>Addiction When Gambling Becomes</li>
                  <li>Protective Preventative Maintenance</li>
                </ul>
              </li>
              <li>Dealing With Technical Support 10 Useful Tips</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">Ordered List</h2>
            <ol className="list-decimal list-inside space-y-2 text-foreground marker:text-primary">
              <li>Fta Keys</li>
              <li>For Women Only Your Computer Usage</li>
              <li>
                Facts Why Inkjet Printing Is Very Appealing
                <ol className="list-decimal list-inside ml-6 mt-2 space-y-1 marker:text-accent">
                  <li>Addiction When Gambling Becomes</li>
                  <li>Protective Preventative Maintenance</li>
                </ol>
              </li>
              <li>Dealing With Technical Support 10 Useful Tips</li>
            </ol>
          </div>
        </section>

        {/* Form Elements */}
        <section className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-foreground">Form Elements</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
              </div>
              <Input type="email" placeholder="Email" />
              <Input placeholder="Address" />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="City" />
                <Input placeholder="Country" />
              </div>
              <Textarea placeholder="Message" rows={4} />
              <Button className="gradient-cta">Submit</Button>
            </form>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Switches</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Switch id="switch1" />
                  <label htmlFor="switch1">Default Switch</label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="switch2" defaultChecked />
                  <label htmlFor="switch2">Primary Switch</label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="switch3" defaultChecked />
                  <label htmlFor="switch3">Confirm Switch</label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Select Boxes</h3>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Option 1</SelectItem>
                  <SelectItem value="2">Option 2</SelectItem>
                  <SelectItem value="3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Checkboxes</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox id="check1" />
                  <label htmlFor="check1">Sample Checkbox</label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="check2" defaultChecked />
                  <label htmlFor="check2">Primary Checkbox</label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Definition Cards */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-foreground">Definitions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-muted p-6 rounded-xl hover:shadow-elegant transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-foreground">Definition 0{i}</h3>
                <p className="text-muted-foreground">
                  Recently, the US Federal government banned online casinos from operating in America by making it illegal to transfer money to them through any US bank or payment system.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Blockquote */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-foreground">Block Quotes</h2>
          <blockquote className="bg-muted border-l-4 border-primary p-6 rounded-r-xl">
            <p className="text-foreground italic text-lg">
              "MCSE boot camps have its supporters and its detractors. Some people do not understand why you should have to spend money on boot camp when you can get the MCSE study materials yourself at a fraction of the camp price."
            </p>
          </blockquote>
        </section>

        {/* Table */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-foreground">Table</h2>
          <div className="bg-card rounded-xl shadow-soft overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 text-left font-semibold">#</th>
                  <th className="p-4 text-left font-semibold">Countries</th>
                  <th className="p-4 text-left font-semibold">Visits</th>
                  <th className="p-4 text-left font-semibold">Percentages</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4">{row.id}</td>
                    <td className="p-4 font-medium">{row.country}</td>
                    <td className="p-4">{row.visits.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${row.color}`}
                            style={{ width: `${row.percent}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{row.percent}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Elements;
