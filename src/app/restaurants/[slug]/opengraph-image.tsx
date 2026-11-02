import { ImageResponse } from "next/og";
import { formatPriceRange, formatSlugLabel } from "@/lib/format";
import { getRestaurantBySlug } from "@/lib/queries/restaurants";

export const alt = "Restaurant on Makan Finder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function Card({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #fff7ed 0%, #fde68a 100%)",
        color: "#1c1917",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 32, fontWeight: 600 }}>
        Makan Finder
      </div>
      {children}
    </div>
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant)
    return new ImageResponse(<Card>Discover the best Malaysian food</Card>, {
      ...size,
    });

  return new ImageResponse(
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          {restaurant.name}
        </div>
        <div
          style={{
            display: "flex",
            gap: 28,
            fontSize: 36,
            color: "#57534e",
          }}
        >
          <span>{restaurant.avgRating.toFixed(1)} / 5</span>
          <span>{formatSlugLabel(restaurant.cuisine)}</span>
          <span>{formatPriceRange(restaurant.priceRange)}</span>
          {restaurant.isHalal && <span>Halal</span>}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 32, color: "#57534e" }}>
        {restaurant.city}, {formatSlugLabel(restaurant.state)}
      </div>
    </Card>,
    { ...size },
  );
}
