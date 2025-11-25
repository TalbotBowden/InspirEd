export type AvatarProps = {
  pointerEvents?: "auto" | "box-none" | "none" | "box-only";
  onPress?: null | (() => void);
  size?: number;
  source?: string | number | null;
  initials?: string;
  color?: string;
  loading?: boolean;
};
