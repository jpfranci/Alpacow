import React from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { CSSProperties } from "@material-ui/styles";
import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";
import REACT_APP_GOOGLE_API_KEY from "../../env";
import styled from "styled-components";

//TODO: Move out of component because it causes performance issue
const GOOGLE_LIBRARIES: Libraries = ["places"];

/**
 * Google maps components require CSSProperties type objects
 */
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

const googleMapStyle: CSSProperties = {
  width: "80%",
  height: "10em"
};

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1em;
`;

export type Location = {
  name: string;
  lat: number;
  lon: number;
};

let initialLocation: Location | null = null;

/**
 * For autocomplete to populate when the user actually selects something
 */
let currLocation: any = null;

const onAutoCompleteLoad = (autocomplete: any) => {
  currLocation = autocomplete;
};

const Map = () => {
  const [ctr, setCtr] = React.useState({
    lat: 49.26,
    lng: -123.22,
  });
  const [, setName] = React.useState("Vancouver");

  if (initialLocation == null) {
    navigator.geolocation.getCurrentPosition(function (position) {
      initialLocation = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: ""
      };
      setCtr({
        lat: initialLocation.lat,
        lng: initialLocation.lon,
      });
    });
  }

  const updateOnDrag = (e: any) => {
    setCtr({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  const onPlaceChanged = async () => {
    if (currLocation !== null) {
      const newLat = currLocation.getPlace().geometry.location.lat();
      const newLon = currLocation.getPlace().geometry.location.lng();
      const newName = currLocation.getPlace().formatted_address;
      setCtr({
        lat: newLat,
        lng: newLon,
      });
      setName(newName);
    }
  };

  return (
    <StyledContainer>
      <LoadScript
        googleMapsApiKey={REACT_APP_GOOGLE_API_KEY}
        libraries={GOOGLE_LIBRARIES}>
        <GoogleMap mapContainerStyle={googleMapStyle} center={ctr} zoom={12}>
          <Autocomplete
            onLoad={onAutoCompleteLoad}
            onPlaceChanged={onPlaceChanged}
            fields={["geometry.location", "formatted_address"]}>
            <input
              type="text"
              placeholder="Enter location"
              style={autocompleteStyle}
            />
          </Autocomplete>
          <Marker position={ctr} draggable={true} onDragEnd={updateOnDrag} />
        </GoogleMap>
      </LoadScript>
    </StyledContainer>
  );
};

export default React.memo(Map);
