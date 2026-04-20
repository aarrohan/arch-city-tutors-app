import { LinkIcon } from "lucide-react-native";
import {
  Linking,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import colors from "@/constants/colors";

const URL_REGEX = /(\b(https?:\/\/|www\.)[^\s<]+[^\s<.,;:!?()\]]+)/gi;

interface Props {
  text: string;
  textStyle?: object | object[];
  isMe?: boolean;
}

type Segment = { type: "text"; value: string } | { type: "link"; href: string };

export default function Linkify({ text, textStyle, isMe }: Props) {
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(URL_REGEX.source, URL_REGEX.flags);

  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;

    if (start > lastIndex) {
      segments.push({ type: "text", value: text.substring(lastIndex, start) });
    }

    let href = match[0];
    if (!href.startsWith("http://") && !href.startsWith("https://")) {
      href = "https://" + href;
    }

    segments.push({ type: "link", href });
    lastIndex = end;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.substring(lastIndex) });
  }

  if (
    segments.length === 0 ||
    (segments.length === 1 && segments[0].type === "text")
  ) {
    return <Text style={textStyle}>{text}</Text>;
  }

  return (
    <View style={styles.wrap}>
      {segments.map((seg, i) =>
        seg.type === "text" ? (
          <Text key={i} style={textStyle}>
            {seg.value}
          </Text>
        ) : (
          <TouchableOpacity
            key={i}
            activeOpacity={0.75}
            onPress={() => Linking.openURL(seg.href)}
            style={[
              styles.linkBtn,
              isMe ? styles.linkBtnMe : styles.linkBtnOther,
            ]}
          >
            <LinkIcon
              size={11}
              color={isMe ? colors.primary : colors.secondary}
            />
            <Text
              style={[
                styles.linkText,
                isMe ? styles.linkTextMe : styles.linkTextOther,
              ]}
            >
              Link
            </Text>
          </TouchableOpacity>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  linkBtnMe: {
    backgroundColor: "#fff",
  },
  linkBtnOther: {
    backgroundColor: colors.primary,
  },
  linkText: {
    fontSize: 12,
    fontWeight: "600",
  },
  linkTextMe: {
    color: colors.primary,
  },
  linkTextOther: {
    color: colors.secondary,
  },
});
