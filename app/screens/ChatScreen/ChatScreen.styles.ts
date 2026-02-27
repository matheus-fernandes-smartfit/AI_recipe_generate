import { StyleSheet } from "react-native";
import { theme } from "../../theme";

const { colors, spacing, radius, typography } = theme;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  smallButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  smallButtonText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  muted: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
  },
  bubble: {
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    maxWidth: "85%",
  },
  bubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: colors.userBubble,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    alignSelf: "flex-start",
    backgroundColor: colors.assistantBubble,
    borderBottomLeftRadius: 4,
  },
  bubbleTextUser: {
    ...typography.body,
    color: colors.surface,
    lineHeight: 21,
  },
  bubbleTextAssistant: {
    ...typography.body,
    color: colors.assistantBubbleText,
    lineHeight: 21,
  },
  chatComposer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    fontSize: 15,
    color: colors.text,
    maxHeight: 100,
  },
  chatSend: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  chatSendDisabled: {
    opacity: 0.5,
  },
  chatSendText: {
    ...typography.label,
    color: colors.surface,
  },
});
