import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import "./global.css";

export default function RootLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Todo</Label>
        <Icon sf="list.bullet" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="calendar">
        <Icon sf="calendar" />
        <Label>カレンダー</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
