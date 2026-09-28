export default function Loading() {
  return (
    <div className="shell page-section" role="status" aria-label="Loading page" aria-busy="true">
      <div className="page-skeleton" aria-hidden="true">
        <span className="page-skeleton__label" />
        <span className="page-skeleton__heading" />
        <span className="page-skeleton__line" />
        <span className="page-skeleton__line" />
        <span className="page-skeleton__content" />
      </div>
    </div>
  );
}
