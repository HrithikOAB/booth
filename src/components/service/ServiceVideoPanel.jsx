export default function ServiceVideoPanel({ service }) {
  if (!service?.youtubeId) {
    return (
      <div className="service-modal-media" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#a7b5c3" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{service?.icon}</div>
          <p>No demo video for this service yet.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="service-modal-media">
      <iframe
        key={service.youtubeId}
        src={`https://www.youtube-nocookie.com/embed/${service.youtubeId}?rel=0&modestbranding=1`}
        title={`${service.name} demo`}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
