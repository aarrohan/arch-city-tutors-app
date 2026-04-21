import TabBarIcon from "@/components/ui/TabBarIcon";
import colors from "@/constants/colors";
import { getRgbValues } from "@/lib/utils";
import { Tabs } from "expo-router";
import {
  CalendarDaysIcon,
  HouseIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react-native";

export default function ParentDashboardTabsLayout() {
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

      <Tabs.Screen name="students" options={{ href: null }} />

      <Tabs.Screen
        name="find"
        options={{
          title: "Find",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={
                <SearchIcon
                  size={20}
                  color={focused ? colors.accent : colors.primaryLight}
                  style={{ zIndex: 2, marginTop: 12 }}
                />
              }
              title="Find"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="schedules"
        options={{
          title: "Schedules",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={
                <CalendarDaysIcon
                  size={20}
                  color={focused ? colors.accent : colors.primaryLight}
                  style={{ zIndex: 2, marginTop: 12 }}
                />
              }
              title="Schedules"
            />
          ),
        }}
      />

      <Tabs.Screen name="history" options={{ href: null }} />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={
                <UserIcon
                  size={20}
                  color={focused ? colors.accent : colors.primaryLight}
                  style={{ zIndex: 2, marginTop: 12 }}
                />
              }
              title="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
}
