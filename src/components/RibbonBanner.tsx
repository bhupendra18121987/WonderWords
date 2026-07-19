interface RibbonBannerProps {
  title: string;
  topGarnish?: string;
}

export default function RibbonBanner({ title, topGarnish }: RibbonBannerProps) {
  return (
    <div className="ribbon-wrap">
      {topGarnish && <div className="ribbon-garnish" aria-hidden="true">{topGarnish}</div>}
      <div className="ribbon-main">
        <span className="ribbon-notch left" aria-hidden="true" />
        <h2>{title}</h2>
        <span className="ribbon-notch right" aria-hidden="true" />
      </div>
    </div>
  );
}
