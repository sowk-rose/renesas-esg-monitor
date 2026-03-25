// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  "house.fill": "dashboard",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chart.bar.fill": "bar-chart",
  "doc.text.fill": "description",
  "lightbulb.fill": "lightbulb",
  "checklist": "checklist",
  "arrow.up": "arrow-upward",
  "arrow.down": "arrow-downward",
  "exclamationmark.triangle.fill": "warning",
  "bell.fill": "notifications",
  "person.3.fill": "groups",
  "gearshape.fill": "settings",
  "magnifyingglass": "search",
  "arrow.right": "arrow-forward",
  "clock.fill": "schedule",
  "flag.fill": "flag",
  "star.fill": "star",
  "info.circle.fill": "info",
  "xmark": "close",
  "plus": "add",
  "minus": "remove",
  "checkmark": "check",
  "leaf.fill": "eco",
  "globe": "public",
  "shield.fill": "shield",
  "brain": "psychology",
  "newspaper.fill": "article",
  "play.fill": "play-arrow",
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
