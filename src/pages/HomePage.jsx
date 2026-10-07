import { useNavigate } from "react-router-dom";
import HomeVideoLoop from "../components/HomeVideoLoop.jsx";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="stage home-loop-stage">
      <div className="pulse-strip" />
      <HomeVideoLoop />
      <div className="home-loop-actions">
        <button type="button" className="cta cta--btn" onClick={() => navigate("/explore/v2")}>
          <div className="cta-text">
            Tap to explore the platform <span className="arrow">&rarr;</span>
          </div>
          <div className="cta-sub">Interactive architecture, services &amp; demos</div>
        </button>
        <button type="button" className="cta cta--btn cta--secondary" onClick={() => navigate("/industries")}>
          <div className="cta-text cta-text--sm">Explore industries</div>
        </button>
      </div>
    </div>
  );
}
