import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("transactions", "routes/transactions.tsx"),
  route("analytics", "routes/analytics.tsx"),
  route("settings", "routes/settings.tsx"),
] satisfies RouteConfig;
