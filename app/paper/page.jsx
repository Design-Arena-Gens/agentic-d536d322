export default function PaperPage() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 20 }}>Multi Agent Code Review and Debugging Network System</h2>
      <section style={{ background: '#111827', border: '1px solid #22304a', borderRadius: 10, padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Abstract</h3>
        <p style={{ color: '#c9d1d9', lineHeight: 1.6 }}>
          We propose an end to end system, the Multi Agent Code Review and Debugging Network, that uses three collaborative LLM based agents to automate software quality assurance. The Code Reviewer agent flags logic errors, style violations, and security issues; the Bug Finder agent simulates execution to detect potential defects; and the Refactor agent suggests safe, maintainable code improvements. The system integrates with GitHub to review real world repositories and output actionable feedback to developers. We will implement and evaluate the system on open source code within a 5 week development cycle, demonstrating alignment with course objectives.
        </p>
        <p style={{ color: '#9aa7b2' }}>Index Terms? LLM Agents, Code Review, Debugging, Generative AI, Software Engineering, GitHub Integration</p>
      </section>
      <section style={{ background: '#111827', border: '1px solid #22304a', borderRadius: 10, padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Introduction</h3>
        <p style={{ color: '#c9d1d9', lineHeight: 1.6 }}>
          Code review is a critical yet time consuming step in modern software development aimed at catching bugs and enforcing coding standards. Recent advances in large language models enable scalable automation of routine review workflows. We present an integrated, web-deployable system that operationalizes three complementary agents to deliver practical, actionable review output on real repositories.
        </p>
      </section>
    </div>
  );
}
