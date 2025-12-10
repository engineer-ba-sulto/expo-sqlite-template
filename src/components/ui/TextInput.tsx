import { forwardRef } from "react";
import { TextInput as RNTextInput, type TextInputProps } from "react-native";

export default forwardRef<RNTextInput, TextInputProps>(function TextInput(props, ref) {
  return (
    <RNTextInput
      ref={ref}
      className="border border-gray-300 rounded-lg px-4 py-3 text-base"
      {...props}
    />
  );
});
