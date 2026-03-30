import type { PropsWithChildren } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <p>{description}</p>
    </div>
  );
}

export function Panel({
  children,
  kicker,
  title,
  badge,
  large = false
}: PropsWithChildren<{
  kicker: string;
  title: string;
  badge?: string;
  large?: boolean;
}>) {
  return (
    <article className={`panel ${large ? "large" : ""}`}>
      <div className="panel-header">
        <div>
          <span className="panel-kicker">{kicker}</span>
          <h3>{title}</h3>
        </div>
        {badge ? <span className="pill">{badge}</span> : null}
      </div>
      {children}
    </article>
  );
}
