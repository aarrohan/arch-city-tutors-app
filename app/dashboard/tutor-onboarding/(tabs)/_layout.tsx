import TabBarIcon from "@/components/ui/TabBarIcon";
import colors from "@/constants/colors";
import { getRgbValues } from "@/lib/utils";
import { Tabs } from "expo-router";
import { HouseIcon, ScrollIcon } from "lucide-react-native";

export default function TutorOnboardingTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          marginBottom: 25,
          marginHorizontal: 25,
          height: 64,
          borderWidth: 1,
          borderColor: `rgba(${getRgbValues(colors.primary)}, 0.1)`,
          backgroundColor: colors.secondary,
          borderRadius: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Overview",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={
                <HouseIcon
                  size={20}
                  color={focused ? colors.accent : colors.primaryLight}
                  style={{ zIndex: 2, marginTop: 12 }}
                />
              }
              title="Overview"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="applications"
        options={{
          title: "Applications",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={
                <ScrollIcon
                  size={20}
                  color={focused ? colors.accent : colors.primaryLight}
                  style={{ zIndex: 2, marginTop: 12 }}
                />
              }
              title="Applications"
            />
          ),
        }}
      />
    </Tabs>
  );
}
