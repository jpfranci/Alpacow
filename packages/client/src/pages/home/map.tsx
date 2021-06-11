import React, { useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { CSSProperties } from "@material-ui/styles";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";
import { getLocation, setLocation } from "../../redux/slices/locationSlice";
import REACT_APP_GOOGLE_API_KEY from "../../env";
import styled from "styled-components";

//TODO: Move out of component because it causes performance issue
const GOOGLE_LIBRARIES: Libraries = ["places"];

const googleMapStyle: CSSProperties = {
  width: "80%",
  height: "10em"
};

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1em;
`;

//TODO: Use built in material ui styles
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
 * For autocomplete to populate when the user actually selects something
 */
let currLocation: any = null;

const onAutoCompleteLoad = (autocomplete: any) => {
  console.log("autocomplete: ", autocomplete);

  currLocation = autocomplete;
};

const Map = () => {
  const dispatch = useAppDispatch();
  const location = useAppSelector((state) => state.location);

  useEffect(() => {
    dispatch(() => getLocation());
  }, [dispatch]);

  const [ctr, setCtr] = React.useState({
    lat: location.lat,
    lng: location.lon,
  });
  const [name, setName] = React.useState(location.name);

  const updateOnDrag = (e: any) => {
    setCtr({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    updateStore(e.latLng.lat(), e.latLng.lng(), name);
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

      updateStore(newLat, newLon, newName);
    }
  };

  const updateStore = async (
    lat: number,
    lon: number,
    newName: string | undefined,
  ) => {
    try {
      const response = await dispatch(
        setLocation({
          name: newName !== undefined ? newName : name,
          lat: lat,
          lon: lon,
        }),
      );
      return response.payload;
    } catch (error) {
      if (error) {
        alert("location not got NOOOOOO");
      }
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
