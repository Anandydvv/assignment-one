import TabsGen from "./components/TabsGen";

export default function HomePage() {
  return (
    <section>
      <h1 style={{ marginTop: 16 }}>HTML5 + JS Generator for Moodle</h1>
      <p>
        Welcome! This tool builds accessible, copy-paste HTML5 + JavaScript
        snippets you can drop straight into <code>Hello.html</code> or Moodle LMS.
      </p>
      <p>
        It was created as part of <strong>Assignment One</strong> and demonstrates:
        keyboard-accessible components, ARIA roles, cookies, and a light/dark theme
        toggle.
      </p>

      <h2>Pages</h2>
      <ul>
        <li><a href="/">Tabs Generator</a> — the main feature of this project</li>
        <li><a href="/about">Pre-lab / About</a> — answers and project demo video</li>
        <li><a href="/escape-room">Escape Room</a> — placeholder</li>
        <li><a href="/coding-races">Coding Races</a> — placeholder</li>
        <li><a href="/courtroom">Court Room</a> — placeholder</li>
      </ul>

      <h2>Tabs Generator</h2>
      <p>
        Use the tool below to build a tabbed interface. You can edit labels,
        contents, add or remove tabs, and optionally remember the last active tab
        with a cookie. When ready, copy the generated HTML+JS and paste it into
        your own <code>Hello.html</code> file or a Moodle HTML block.
      </p>

      <TabsGen />
    </section>
  );
}
