export default function DeploymentTileNode({ data }) {
  return <div className="arch-deploy-tile" style={{ fontSize: data.small ? 9 : 10 }}>{data.label}</div>;
}
