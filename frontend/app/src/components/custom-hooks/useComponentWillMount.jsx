import { useRef } from "react";

export default function useComponentWillMount(callback) {
  const willMount = useRef(true);

  if (willMount.current) callback();

  willMount.current = false;
}