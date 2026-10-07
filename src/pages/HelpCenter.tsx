import SimplePage from "@/components/SimplePage";

const faqs = [
  ["How do I start learning?", "Sign up, open Subjects, read the short sessions, then play the quizzes."],
  ["How do I earn XP?", "Every correct quiz answer gives you XP. Collect 500 XP to reach the next level."],
  ["Can I change the language?", "Yes. Use the language menu at the top to switch between English, Hindi and Telugu."],
  ["Does it work without internet?", "Pages you've opened before stay available offline. Your progress saves when you reconnect."],
  ["How do I get certificates?", "Open your Dashboard, go to Certificates, and print or save the ones you've earned as PDF."],
];

const HelpCenter = () => (
  <SimplePage title="Help Center" subtitle="Answers to common questions.">
    {faqs.map(([q, a]) => (
      <div key={q}>
        <p className="font-bold text-foreground">{q}</p>
        <p>{a}</p>
      </div>
    ))}
  </SimplePage>
);

export default HelpCenter;
