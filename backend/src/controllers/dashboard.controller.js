import { getCompanyAnalytics } from "../services/analytics.service.js";

export const getDashboard = async (req, res) => {
  try {
    const analytics = await getCompanyAnalytics(req.companyId);

    res.json({
      dashboard: analytics,
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};