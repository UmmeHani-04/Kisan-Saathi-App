<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- Keep the supplied frontend in a dedicated FarmingApp component rendered by the index route so the original content and interactions remain auditable.
- Keep all visual styling in the global semantic design system so sections and controls stay consistent.
- Preserve the existing external chat API contract in the browser; allow VITE_CHAT_API_URL to configure its origin without adding a replacement backend.
- Use AI Elements for assistant responses, loading feedback, and the composer so accessibility and message rendering use maintained primitives.
- The chat backend lives in the sibling `../backend` folder (Express, port 8000). It is deliberately separate from this frontend project. The request contract is `POST /api/chat` with `{ message, history?, language? }` returning `{ reply }` (errors return `{ error }`).
