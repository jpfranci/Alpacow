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

//TODO: Move out of component
const google_libraries: Libraries = ["places"];

const containerStyle = {
  width: "80%",
  height: "10em",
};

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

  const [ctr, setCtr] = React.useState({ lat: location.lat, lng: location.lon });
  const [name, setName] = React.useState(location.name);

  const updateOnDrag = (e: any) =>
    setCtr({ lat: e.latLng.lat(), lng: e.latLng.lng() });

  const onPlaceChanged = async () => {
    if (currLocation !== null) {
      setCtr({
        lat: currLocation.getPlace().geometry.location.lat(),
        lng: currLocation.getPlace().geometry.location.lng(),
      });
      setName(currLocation.getPlace().formatted_address);

      try {
        await dispatch(
          setLocation({
            name: name,
            lat: ctr.lat,
            lon: ctr.lng
          })
        );
      } catch (error) {
        if (error) {
          alert("location not got NOOOOOO");
        }
      }
    }
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyByPJxeMYuxpuud2csQ3aui0iydKeNXubc"
      libraries={google_libraries}>
      <GoogleMap mapContainerStyle={containerStyle} center={ctr} zoom={12}>
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
  );
};

export default React.memo(Map);
