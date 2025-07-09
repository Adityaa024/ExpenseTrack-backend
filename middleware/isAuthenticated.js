import jwt from "jsonwebtoken";

// Middleware to check if the user is authenticated via JWT in cookies
const isAuthenticated = async (req, res, next) => {
  try {
    // Step 1: Extract token from cookies
    const token = req.cookies.token;

    // Step 2: If no token found, block access
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
        success: false,
      });
    }

    // Step 3: Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Step 4: If verification fails, block access (technically this is caught by the catch block)
    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized: Invalid token",
        success: false,
      });
    }

    // Step 5: Attach user ID from decoded token to request object
    req.id = decoded.id; // Make sure you used `id` when creating the token

    // Step 6: Proceed to the next middleware or route
    next();         //next is used in router first check it is authenticated then router.route("/add").post(isAuthenticated,addExpense); this add expense will run
    
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export default isAuthenticated;
