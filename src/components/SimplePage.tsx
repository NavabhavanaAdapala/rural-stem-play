import Layout, { PageHeader } from "@/components/Layout";
import { Card } from "@/components/ui";

const SimplePage = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Layout>
    <PageHeader title={title} subtitle={subtitle} />
    <div className="container max-w-3xl py-10">
      <Card className="space-y-4 p-8 text-muted-foreground">{children}</Card>
    </div>
  </Layout>
);

export default SimplePage;
