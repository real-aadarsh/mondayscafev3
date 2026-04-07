import { menuPosters } from "../data/siteData";

export default function MenuPage() {
  return (
    <main className="route-main">
      <section className="section route-hero reveal-item">
        <div className="container">
          <p className="eyebrow">Menu</p>
          <h1 className="route-title">Morning and Afternoon Menu</h1>
          <p className="route-copy">Exact V1 menu details with all item breakdowns and pricing.</p>
        </div>
      </section>

      <section className="section">
        <div className="container menu-posters-v2">
          {menuPosters.map((poster) => (
            <article className="menu-poster-v2 reveal-item" key={poster.title}>
              <h2 className="menu-poster-title">{poster.title}</h2>

              <div className="menu-poster-top">
                {poster.columnsTop.map((column) => (
                  <div className="menu-poster-col" key={column.heading}>
                    <h3>{column.heading}</h3>
                    {column.meta && <p className="menu-poster-meta">{column.meta}</p>}
                    {column.lines.map((line, index) => (
                      <p className="menu-poster-line" key={`${column.heading}-${index}`}>
                        <span>{line.name}</span>
                        {line.price && <strong>{line.price}</strong>}
                      </p>
                    ))}
                    {column.notes?.map((note, index) => (
                      <div className="menu-poster-note-block" key={`${column.heading}-note-${index}`}>
                        {note.heading && <h4>{note.heading}</h4>}
                        {note.text && <p className="menu-poster-note">{note.text}</p>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="menu-poster-divider"></div>
              <h3 className="menu-poster-section">{poster.sectionBottom.title}</h3>

              <div className="menu-poster-bottom">
                {poster.sectionBottom.columns.map((column, colIndex) => (
                  <div className="menu-poster-col" key={`${poster.title}-bottom-${colIndex}`}>
                    {column.map((line, lineIndex) => (
                      <div key={`${poster.title}-line-${colIndex}-${lineIndex}`}>
                        {line.noteHeading && <h4>{line.noteHeading}</h4>}
                        {line.noteMeta && <p className="menu-poster-meta">{line.noteMeta}</p>}
                        {line.name && (
                          <p className="menu-poster-line">
                            <span>{line.name}</span>
                            {line.price && <strong>{line.price}</strong>}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
