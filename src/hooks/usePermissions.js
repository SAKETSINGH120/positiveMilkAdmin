import { useAuth } from "../context/AuthContext";


/**
 * A custom hook to manage role-based permissions.
 *
 * @returns {{hasPermission: (requiredPermissions: string[]) => boolean}}
 * An object containing the `hasPermission` function.
 */
export const usePermissions = () => {
    const { admin, adminRole } = useAuth();

    /**
     * Checks if the current admin has the required permissions.
     * @param {string[]} requiredPermissions - An array of permission strings required to access a resource.
     * @returns {boolean} - True if the user has permission, otherwise false.
     */
    const hasPermission = (requiredPermissions) => {
        // If admin data is not yet loaded, deny access.
        if (!admin) {
            return false;
        }

        // A super admin has all permissions, so always grant access.
        if (admin.isSuperAdmin) {
            return true;
        }

        // If it's a regular admin, but their role or permissions are missing, deny access.
        if (!adminRole || !adminRole.permissions) {
            return false;
        }

        // If a menu item doesn't require any specific permissions, grant access.
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        // Check if the admin's role includes ALL of the required permissions.
        // The `every` method ensures that every permission in `requiredPermissions`
        // is present in the `adminRole.permissions` array.
        return requiredPermissions.every(p => adminRole.permissions.includes(p));
    };

    return { hasPermission };
};