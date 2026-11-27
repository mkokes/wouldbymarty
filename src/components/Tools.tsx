import { TOOLS_EYEBROW, TOOLS_HEADING, TOOLS_INTRO, WORKSHOP_TOOLS, type WorkshopTool } from '../lib/site';

function SegmentorMark() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true">
      <rect width="512" height="512" rx="112" fill="#1C1410" />
      <g transform="translate(256 256)">
        <path
          d="M 0,-184 A 184,184 0 0,1 92,-159.3 L 52,-90.1 A 104,104 0 0,0 0,-104 Z"
          fill="#E8D4B4"
          stroke="#1C1410"
          strokeWidth="5"
        />
        <path
          d="M 92,-159.3 A 184,184 0 0,1 159.3,-92 L 90.1,-52 A 104,104 0 0,0 52,-90.1 Z"
          fill="#C8843E"
          stroke="#1C1410"
          strokeWidth="5"
        />
        <path
          d="M 159.3,-92 A 184,184 0 0,1 184,0 L 104,0 A 104,104 0 0,0 90.1,-52 Z"
          fill="#5C3A21"
          stroke="#1C1410"
          strokeWidth="5"
        />
        <path
          d="M 184,0 A 184,184 0 0,1 159.3,92 L 90.1,52 A 104,104 0 0,0 104,0 Z"
          fill="#A55233"
          stroke="#1C1410"
          strokeWidth="5"
        />
        <path
          d="M 159.3,92 A 184,184 0 0,1 92,159.3 L 52,90.1 A 104,104 0 0,0 90.1,52 Z"
          fill="#E8D4B4"
          stroke="#1C1410"
          strokeWidth="5"
        />
        <path
          d="M 92,159.3 A 184,184 0 0,1 0,184 L 0,104 A 104,104 0 0,0 52,90.1 Z"
          fill="#C8843E"
          stroke="#1C1410"
          strokeWidth="5"
        />
        <path
          d="M 0,184 A 184,184 0 0,1 -92,159.3 L -52,90.1 A 104,104 0 0,0 0,104 Z"
          fill="#5C3A21"
          stroke="#1C1410"
          strokeWidth="5"
        />
        <path
          d="M -92,159.3 A 184,184 0 0,1 -159.3,92 L -90.1,52 A 104,104 0 0,0 -52,90.1 Z"
          fill="#A55233"
          stroke="#1C1410"
          strokeWidth="5"
        />
        <path
          d="M -159.3,92 A 184,184 0 0,1 -184,0 L -104,0 A 104,104 0 0,0 -90.1,52 Z"
          fill="#E8D4B4"
          stroke="#1C1410"
          strokeWidth="5"
        />
        <path
          d="M -184,0 A 184,184 0 0,1 -159.3,-92 L -90.1,-52 A 104,104 0 0,0 -104,0 Z"
          fill="#C8843E"
          stroke="#1C1410"
          strokeWidth="5"
        />
        <path
          d="M -159.3,-92 A 184,184 0 0,1 -92,-159.3 L -52,-90.1 A 104,104 0 0,0 -90.1,-52 Z"
          fill="#5C3A21"
          stroke="#1C1410"
          strokeWidth="5"
        />
        <path
          d="M -92,-159.3 A 184,184 0 0,1 0,-184 L 0,-104 A 104,104 0 0,0 -52,-90.1 Z"
          fill="#A55233"
          stroke="#1C1410"
          strokeWidth="5"
        />
        <circle r="100" fill="none" stroke="#F6EFE4" strokeWidth="6" />
        <circle r="54" fill="#C8843E" stroke="#F6EFE4" strokeWidth="5" />
        <circle r="16" fill="#1C1410" />
      </g>
    </svg>
  );
}

function ToolMark({ id }: { id: string }) {
  if (id === 'segmentor') {
    return <SegmentorMark />;
  }
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#1C1410" />
      <circle cx="32" cy="32" r="14" fill="none" stroke="#C8843E" strokeWidth="4" />
    </svg>
  );
}

export function Tools({ tools = WORKSHOP_TOOLS }: { tools?: WorkshopTool[] }) {
  const single = tools.length === 1;

  return (
    <section id="tools" className="tools container" aria-labelledby="tools-heading">
      <div className="tools__header" data-reveal>
        <p className="eyebrow">{TOOLS_EYEBROW}</p>
        <h2 id="tools-heading" className="section-heading">
          {TOOLS_HEADING}
        </h2>
        <p className="tools__intro">{TOOLS_INTRO}</p>
      </div>

      <ul className={`tools-grid ${single ? 'tools-grid--single' : ''}`}>
        {tools.map((tool) => (
          <li key={tool.id} className="tool-card" data-reveal>
            <a className="tool-card__mark" href={tool.url} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
              <ToolMark id={tool.id} />
            </a>
            <div className="tool-card__body">
              <div className="tool-card__meta">
                <span className="eyebrow">{tool.category}</span>
                <span className="tool-card__badge">{tool.status}</span>
              </div>
              <h3 className="tool-card__title">{tool.name}</h3>
              <p className="tool-card__summary">{tool.summary}</p>
              <div className="tool-card__features">
                {tool.features.map((feature) => (
                  <span key={feature} className="tool-card__feature">
                    {feature}
                  </span>
                ))}
              </div>
              <div className="tool-card__actions">
                <a className="btn btn-primary" href={tool.url} target="_blank" rel="noopener noreferrer">
                  Launch {tool.name}
                </a>
                {tool.repoUrl && (
                  <a className="text-link" href={tool.repoUrl} target="_blank" rel="noopener noreferrer">
                    Source on GitHub <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
