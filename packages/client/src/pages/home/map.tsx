import React from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import { CSSProperties } from "@material-ui/styles";

const containerStyle = {
  width: "80%",
  height: "10em",
};

const autocompleteStyle: CSSProperties = {
  boxSizing: "border-box",
  border: "1px solid transparent",
  width: "240px",
  height: "32px",
  padding: "0 12px",
  borderRadius: "3px",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
  fontSize: "14px",
  outline: "none",
  textOverflow: "ellipses",
  position: "absolute",
  left: "50%",
  marginLeft: "-120px",
};

/**
 * Initial center is at UBC in case the user doesn't have location enabled browser
 */
const center = {
  lat: 49.26,
  lng: -123.22,
};

navigator.geolocation.getCurrentPosition(function (position) {
  center.lat = position.coords.latitude;
  center.lng = position.coords.longitude;
});

const onLoad = (marker: any) => {
  console.log("marker: ", marker);
};

const autocomplete: any = null;

const onAutoCompleteLoad = (autocomplete:any) => {
  console.log("autocomplete: ", autocomplete);

  autocomplete = autocomplete;
}

const onPlaceChanged = () => {
  if (autocomplete !== null) {
    console.log(autocomplete.getPlace());
  } else {
    console.log("Autocomplete is not loaded yet!");
  }
}

const Map = () => {
  const [ctr, setCtr] = React.useState(center);
  const forceUpdate = (e: any) => setCtr({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  return (
    <LoadScript googleMapsApiKey="AIzaSyByPJxeMYuxpuud2csQ3aui0iydKeNXubc" libraries={["places"]}>
      <GoogleMap mapContainerStyle={containerStyle} center={ctr} zoom={12}>
        <Autocomplete onLoad={onAutoCompleteLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Enter location"
            style={autocompleteStyle}
          />
        </Autocomplete>
        <Marker
          onLoad={onLoad}
          position={ctr}
          draggable={true}
          onDragEnd={forceUpdate}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default React.memo(Map);
