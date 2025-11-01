import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary";
}

export default function Button({
  title,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg items-center justify-center";
  const variantStyles =
    variant === "primary"
      ? "bg-blue-500 active:bg-blue-600"
      : "bg-gray-200 active:bg-gray-300";

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variantStyles} ${className || ""}`}
      {...props}
    >
      <Text
        className={
          variant === "primary" ? "text-white font-semibold" : "text-gray-800"
        }
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
