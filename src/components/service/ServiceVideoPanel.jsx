export default function ServiceVideoPanel({ service }) {
  if (!service?.video) {
    return (
      <div className="service-modal-media" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#a7b5c3" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{service?.icon}</div>
          <p>Live demo available at the booth — ask a Cloudera expert.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="service-modal-media">
      <video key={service.video} controls playsInline muted preload="metadata">
        <source src={service.video} type="video/mp4" />
        {service.captions && <track kind="captions" src={service.captions} srcLang="en" label="English" default />}
      </video>
    </div>
  );
}
