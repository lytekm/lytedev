import Link from "next/link";
import { setAnalyticsExclusion } from "@/app/admin/(protected)/analytics-actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { ANALYTICS_RANGES, type AnalyticsRange } from "@/lib/analytics/shared";
import type { AnalyticsResult } from "@/lib/analytics/server";
import styles from "./analytics-panel.module.css";

const numbers = new Intl.NumberFormat("en-CA");
const dates = new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", timeZone: "UTC" });
const timestamps = new Intl.DateTimeFormat("en-CA", {
  year: "numeric", month: "short", day: "numeric",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23", timeZone: "UTC",
});

function Timestamp({ value }: { value: string }) {
  return <time dateTime={value}>{timestamps.format(new Date(value))}</time>;
}

export function AnalyticsPanel({ result, days, browserExcluded, trackingEnabled }: {
  result: AnalyticsResult;
  days: AnalyticsRange;
  browserExcluded: boolean;
  trackingEnabled: boolean;
}) {
  const { report, error } = result;
  const peak = Math.max(1, ...(report?.daily.map((day) => day.views) ?? []));
  const titles = new Map(report?.pages.map((page) => [page.path, page.title]));

  return (
    <section className={`stack-lg ${styles.analytics}`} aria-labelledby="analytics-title">
      <div className={styles.heading}>
        <div className="stack-sm">
          <h2 id="analytics-title">Page views</h2>
          <p className="muted">What people are reading, and when. Dates and times are in UTC.</p>
        </div>
        <nav className={styles.ranges} aria-label="Analytics date range">
          {ANALYTICS_RANGES.map((range) => (
            <Link key={range} href={`/admin?days=${range}`} scroll={false}
              className={`button ${days === range ? "button--primary" : ""}`}
              aria-current={days === range ? "page" : undefined}>
              {range} days
            </Link>
          ))}
          <a href={`/admin?days=${days}`} className="button">Refresh</a>
        </nav>
      </div>

      <div className={`card ${styles.exclusion}`}>
        <div className="stack-sm">
          <h3>{browserExcluded ? "This browser is excluded" : "Signed-out visits from this browser count"}</h3>
          <p className="muted">
            Visits while you’re signed in as admin are always excluded.
            {browserExcluded
              ? " This browser also stays excluded after you sign out."
              : " Exclude this browser to keep your visits out after you sign out, too."}
            {" "}Sign in once on each browser you use to set this up.
          </p>
        </div>
        <form action={setAnalyticsExclusion}>
          <input type="hidden" name="exclude" value={browserExcluded ? "0" : "1"} />
          <SubmitButton label={browserExcluded ? "Count signed-out visits" : "Exclude this browser"} pendingLabel="Saving..." />
        </form>
      </div>

      {!trackingEnabled ? (
        <p className={styles.notice}>Tracking is paused in this environment. Local development and preview deployments are excluded by default.</p>
      ) : null}

      {error || !report ? (
        <div className="card stack-sm" role="status">
          <h3>{error === "setup" ? "Analytics needs its database migration" : "Couldn’t load analytics"}</h3>
          <p className="muted">
            {error === "setup"
              ? "Run supabase/migrations/202609280001_add_page_view_analytics.sql in Supabase, then refresh this page. Views will be saved from that point on."
              : "The report is unavailable right now. Refresh to try again."}
          </p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="card stat-card">
              <span className="eyebrow">Last {days} days</span>
              <strong>{numbers.format(report.total_views)}</strong>
              <span className="muted">Page views</span>
            </div>
            <div className="card stat-card">
              <span className="eyebrow">Today</span>
              <strong>{numbers.format(report.today_views)}</strong>
              <span className="muted">Since midnight UTC</span>
            </div>
            <div className="card stat-card">
              <span className="eyebrow">Pages viewed</span>
              <strong>{numbers.format(report.pages_viewed)}</strong>
              <span className="muted">Different pages in this period</span>
            </div>
          </div>

          {!report.total_views ? (
            <div className="card stack-sm">
              <h3>No views in this period yet.</h3>
              <p className="muted">Views will appear when someone visits a public page. Your excluded browsers and admin pages won’t add to the count.</p>
            </div>
          ) : null}

          <div className="card stack-md">
            <div className={styles.heading}>
              <h3>Daily activity</h3>
              <span className={styles.caption}>Peak: {numbers.format(Math.max(0, ...report.daily.map((day) => day.views)))} views / day</span>
            </div>
            <figure>
              <div className={styles.chart} style={{ gridTemplateColumns: `repeat(${days}, minmax(0, 1fr))` }} aria-hidden="true">
                {report.daily.map((day) => (
                  <div key={day.date} className={styles.barTrack} title={`${day.date}: ${numbers.format(day.views)} views`}>
                    <span className={styles.bar} style={{ height: `${day.views / peak * 100}%` }} />
                  </div>
                ))}
              </div>
              <figcaption className={styles.chartLabels}>
                <span>{report.daily[0] ? dates.format(new Date(report.daily[0].date)) : ""}</span>
                <span>Daily counts below</span>
                <span>Today</span>
              </figcaption>
            </figure>
            <details className={styles.details}>
              <summary>Daily counts</summary>
              <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Daily page view counts">
                <table className={styles.table}>
                  <thead><tr><th scope="col">Date (UTC)</th><th scope="col">Views</th></tr></thead>
                  <tbody>
                    {[...report.daily].reverse().map((day) => (
                      <tr key={day.date}><td><time dateTime={day.date}>{day.date}</time></td><td className={styles.number}>{numbers.format(day.views)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>

          <div className="card stack-md">
            <div className="stack-sm">
              <h3>Views by page</h3>
              <p className="muted">Counts and first / latest views within the selected period.</p>
            </div>
            {report.pages.length ? (
              <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Views by page">
                <table className={styles.table}>
                  <thead><tr><th scope="col">Page</th><th scope="col">Views</th><th scope="col">First view (UTC)</th><th scope="col">Latest view (UTC)</th></tr></thead>
                  <tbody>
                    {report.pages.map((page) => (
                      <tr key={page.path}>
                        <th scope="row"><Link href={page.path} className={styles.pageLink}>{page.title}<span>{page.path}</span></Link></th>
                        <td className={styles.number}>{numbers.format(page.views)}</td>
                        <td><Timestamp value={page.first_viewed_at} /></td>
                        <td><Timestamp value={page.last_viewed_at} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="muted">No page views to list yet.</p>}
          </div>

          <div className="card stack-md">
            <div className="stack-sm">
              <h3>Recent views</h3>
              <p className="muted">The latest 50 views in this period, newest first.</p>
            </div>
            {report.recent.length ? (
              <div className={`${styles.tableWrap} ${styles.recent}`} tabIndex={0} role="region" aria-label="Recent page views">
                <table className={styles.table}>
                  <thead><tr><th scope="col">Page</th><th scope="col">Viewed at (UTC)</th></tr></thead>
                  <tbody>
                    {report.recent.map((view, index) => (
                      <tr key={`${view.viewed_at}-${index}`}>
                        <td><Link href={view.path} className={styles.pageLink}>{titles.get(view.path) ?? view.path}<span>{view.path}</span></Link></td>
                        <td><Timestamp value={view.viewed_at} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="muted">No recent views to show.</p>}
          </div>
          <p className={styles.caption}>
            A view is a page load or navigation, including repeat visits. These aren’t unique visitor counts.
            Prefetches, admin pages, common bots, and browsers requesting Do Not Track are excluded.
            No IP addresses or visitor profiles are stored.
          </p>
        </>
      )}
    </section>
  );
}
