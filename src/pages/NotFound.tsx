import { Link } from "react-router-dom";
import SimplePage from "@/components/SimplePage";

const NotFound = () => (
  <SimplePage title="Page not found" subtitle="Oops! This page doesn't exist.">
    <Link to="/" className="font-bold text-primary">Go back home</Link>
  </SimplePage>
);

export default NotFound;
