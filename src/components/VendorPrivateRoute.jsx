import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const VendorPrivateRoute = ({ children }) => {
    const { vendorToken } = useAuth();
    return vendorToken ? children : <Navigate to="/vendor/login" replace/>
}

export default VendorPrivateRoute;