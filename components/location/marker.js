const MapMarker = props => {
  return (
    <div>
      {props.point == "start" ? (
        <img src="/static/icons/marker/start.png" width="35" />
      ) : (
        <img src="/static/icons/marker/marker.png" width="35" />
      )}
    </div>
  );
};
export default MapMarker;
