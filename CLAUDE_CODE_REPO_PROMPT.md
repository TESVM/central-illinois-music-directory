# Claude Code Repo Prompt

Use this prompt in Claude Code when you want it to write the files directly into the current repository instead of only generating code in chat.

```text
You are working directly inside an existing repository in VS Code. Do not only describe the solution. Inspect the repo, decide whether to extend the existing app or scaffold missing files, then write the files into the repo.

Task:
Build a complete musician directory website for Central Illinois, especially Champaign-Urbana, Illinois.

The site serves:
- pastors
- churches
- worship leaders
- event planners
- musicians creating public profiles

Required pages:
1. Homepage
2. Browse Musicians
3. Individual Musician Profile
4. Create Profile
5. Musician Dashboard
6. Church/Pastor Search Request
7. About
8. FAQ
9. Contact
10. Terms and Privacy
11. Admin Moderation

Accessibility requirements:
- Follow WCAG 2.1 Level AA best practices
- Semantic HTML
- Proper heading hierarchy
- Skip link
- Visible keyboard focus states
- Labels for all form fields
- Strong color contrast
- Alt text or equivalent accessible labeling for imagery
- Accessible validation and error messaging
- Responsive on mobile, tablet, and desktop

Implementation rules:
- First inspect the repo structure before editing
- Reuse the existing stack if the repo already has one
- Write production-ready code directly into files
- Prefer modular reusable components
- Use realistic placeholder content relevant to Central Illinois churches and musicians
- If interactive behavior is needed, implement it instead of describing it
- If the app needs sample data, create local mock data files
- If a build or install step is required, run it
- After editing, verify by running the appropriate build or test command
- Summarize what changed, what was verified, and any remaining setup needed

Visual direction:
- modern
- professional
- artistic
- ministry-friendly
- distinctive without clutter
- light neutral background
- tasteful accent colors
- refined typography
- subtle gradients
- soft shadows

Behavior requirements:
- browse page with filters and sorting
- multi-step create-profile form with validation and save-and-continue behavior
- musician profile with church history, events, contact links, and media section
- admin moderation queue with approve/reject controls

Do the work in the repo now.
```
