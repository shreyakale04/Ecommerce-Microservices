// =====================================================
// GET JWT PAYLOAD
// =====================================================

export const getJwtPayload = () => {

    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    try {

        const payload = token.split(".")[1];

        const decodedPayload =
            JSON.parse(
                atob(
                    payload
                        .replace(/-/g, "+")
                        .replace(/_/g, "/")
                )
            );

        console.log("JWT PAYLOAD =", decodedPayload);

        return decodedPayload;

    } catch (error) {

        console.error(
            "Invalid JWT token:",
            error
        );

        return null;
    }
};


// =====================================================
// GET USER ROLE
// =====================================================

export const getUserRole = () => {

    const payload = getJwtPayload();

    if (!payload) {
        return null;
    }

    let role = payload.role;

    if (!role) {
        return null;
    }

    // JWT already contains ROLE_USER / ROLE_ADMIN
    if (!role.startsWith("ROLE_")) {
        role = "ROLE_" + role;
    }

    return role;
};


// =====================================================
// GET USER EMAIL
// =====================================================

export const getUserEmail = () => {

    const payload = getJwtPayload();

    if (!payload) {
        return null;
    }

    // Your JWT stores email inside "sub"
    return payload.sub || null;
};