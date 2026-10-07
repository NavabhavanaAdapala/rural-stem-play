import { useState } from "react";
import { toast } from "sonner";
import SimplePage from "@/components/SimplePage";
import { Button, Input, Label, Textarea } from "@/components/ui";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks! Your message has been noted.");
    setForm({ name: "", email: "", message: "" });
  };
  return (
    <SimplePage title="Contact Us" subtitle="Questions or ideas? We'd love to hear from you.">
      <form onSubmit={submit} className="space-y-4 text-foreground">
        <div><Label>Name</Label><Input required maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><Label>Email</Label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><Label>Message</Label><Textarea required rows={5} maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
        <Button type="submit">Send message</Button>
      </form>
    </SimplePage>
  );
};

export default Contact;
