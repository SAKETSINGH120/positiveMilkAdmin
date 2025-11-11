import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const AdminPrivateRoute = ({ children }) => {
    const { adminToken } = useAuth();

    return adminToken ? children : <Navigate to="/admin/login" replace />;
};

export default AdminPrivateRoute;
