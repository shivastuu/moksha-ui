import { useState, type ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import {
  Button,
  Surface,
  ThemeProvider,
  foundations,
  themes,
  useTheme,
  type ColorScheme,
} from '@shivastu/ui';

const { space, typography } = foundations;

function Section({ title, children }: { title: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: theme.colors.textMuted, fontFamily: theme.nativeFonts?.medium }]}>
        {title}
      </Text>
      <View style={styles.row}>{children}</View>
    </View>
  );
}

export default function App() {
  const system = useColorScheme();
  const [scheme, setScheme] = useState<ColorScheme>(system === 'dark' ? 'dark' : 'light');
  const [paying, setPaying] = useState(false);
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold });

  if (!fontsLoaded) {
    return null;
  }

  const pay = () => {
    setPaying(true);
    setTimeout(() => setPaying(false), 1500);
  };

  return (
    <ThemeProvider colorScheme={scheme} fonts={typography.fontFamily.native} blurView={BlurView}>
      <ScrollView
        style={{ backgroundColor: themes[scheme].colors.background }}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.title, { color: themes[scheme].colors.text }]}>@shivastu/ui</Text>
        <Text style={[styles.subtitle, { color: themes[scheme].colors.textMuted }]}>
          Same components and tokens as the web, rendered with React Native.
        </Text>

        <View style={styles.backdrop}>
          <View style={[styles.blob, { backgroundColor: '#FF7A59', top: -30, left: -20 }]} />
          <View style={[styles.blob, { backgroundColor: '#7158EE', top: 10, right: -30 }]} />
          <View style={[styles.blob, { backgroundColor: '#06B6D4', bottom: -40, left: 90 }]} />
          <Surface variant="glass" padding="xl" radius="xl">
            <Text style={[styles.label, { color: themes[scheme].colors.textMuted }]}>Card balance</Text>
            <Text style={[styles.amount, { color: themes[scheme].colors.text }]}>₹ 24,580.00</Text>
          </Surface>
        </View>

        <Section title="Variants">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </Section>

        <Section title="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Section>

        <Section title="States">
          <Button loading>Paying</Button>
          <Button disabled>Disabled</Button>
        </Section>

        <Section title="Try it">
          <Button fullWidth loading={paying} onPress={pay}>
            {paying ? 'Paying' : 'Pay now'}
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onPress={() => setScheme(scheme === 'light' ? 'dark' : 'light')}
          >
            {`Switch to ${scheme === 'light' ? 'dark' : 'light'} mode`}
          </Button>
        </Section>
      </ScrollView>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.xl, paddingTop: 72, gap: space.xl },
  title: { fontFamily: typography.fontFamily.native.semibold, fontSize: typography.textStyles.heading.fontSize },
  subtitle: { fontFamily: typography.fontFamily.native.regular, fontSize: typography.textStyles.bodySmall.fontSize, marginTop: -space.md },
  section: { gap: space.sm },
  label: { fontSize: typography.textStyles.caption.fontSize, textTransform: 'uppercase', letterSpacing: typography.letterSpacing.wide },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  backdrop: { padding: space.xl, borderRadius: foundations.radius.xl, overflow: 'hidden' },
  blob: { position: 'absolute', width: 160, height: 160, borderRadius: 80, opacity: 0.9 },
  amount: {
    fontFamily: typography.fontFamily.native.semibold,
    fontSize: typography.textStyles.heading.fontSize,
    marginTop: space.xs,
  },
});
