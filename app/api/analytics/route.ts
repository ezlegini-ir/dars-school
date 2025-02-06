import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { subDays, format } from "date-fns";

const analyticsDataClient = new BetaAnalyticsDataClient();

export async function GET() {
  try {
    const propertyId = process.env.GA_PROPERTY_ID; // GA4 Property ID

    // Get yesterday's date to exclude today's data
    const endDate = format(subDays(new Date(), 1), "yyyy-MM-dd");

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate }], // Set the end date to yesterday
      dimensions: [{ name: "date" }],
      metrics: [{ name: "screenPageViews" }],
    });

    // 1. Generate past 30 days list (YYYYMMDD format)
    const last30Days = Array.from({ length: 29 }, (_, i) => {
      return format(subDays(new Date(), 29 - i), "yyyyMMdd");
    });

    // 2. Convert GA response into a dictionary { date: views }
    const viewsMap: Record<string, number> = {};
    response.rows?.forEach((row) => {
      if (!row.dimensionValues || !row.metricValues) return; // Skip if missing data
      const date = row.dimensionValues[0]?.value;
      const views = row.metricValues[0]?.value;
      if (date && views) {
        viewsMap[date] = Number(views);
      }
    });

    // 3. Fill missing dates with 0 views
    const formattedData = last30Days.map((date) => ({
      name: `${date.slice(2, 4)}/${date.slice(4, 6)}/${date.slice(6)}`, // Extract last 2 digits (day)
      views: viewsMap[date] ?? 0, // Use 0 if no data
    }));

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error("GA API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch views" },
      { status: 500 }
    );
  }
}
