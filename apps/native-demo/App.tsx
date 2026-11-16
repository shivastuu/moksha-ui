import { useState, type ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import {
  AccountNumberField,
  AutoForm,
  AmountField,
  Banner,
  BankCard,
  BottomSheet,
  Button,
  Dialog,
  PromoBanner,
  RollingAmount,
  OtpField,
  PhoneField,
  SearchField,
  SnackbarProvider,
  Stagger,
  Surface,
  TextField,
  ThemeProvider,
  defineFields,
  foundations,
  palette,
  themes,
  useSnackbar,
  useTheme,
  type ColorScheme,
} from 'tandemui';

const { space, typography } = foundations;

const addPayee = defineFields([
  { name: 'name', type: 'text', label: 'Payee name', required: true },
  { name: 'account', type: 'account', label: 'Account number', required: true },
  { name: 'confirm', type: 'account', label: 'Confirm account number', required: true, matches: 'account' },
  { name: 'amount', type: 'amount', label: 'Amount', required: true, max: 200000 },
]);

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

function Overlays() {
  const snackbar = useSnackbar();
  const [dialog, setDialog] = useState(false);
  const [sheet, setSheet] = useState(false);
  return (
    <Section title="Overlays">
      <View style={{ width: '100%', gap: space.md }}>
        <PromoBanner
          eyebrow="Travel card"
          title="Pay abroad with zero forex markup"
          action={{ label: 'Get the card', onPress: () => {} }}
        />
        <Banner tone="warning" title="KYC pending" action={{ label: 'Complete KYC', onPress: () => {} }}>
          Finish it to keep using your card.
        </Banner>
      </View>
      <Button variant="secondary" onPress={() => setDialog(true)}>
        Block card
      </Button>
      <Button variant="secondary" onPress={() => setSheet(true)}>
        Pay from
      </Button>
      <Button
        variant="secondary"
        onPress={() => snackbar.show({ message: 'Payee deleted', action: { label: 'Undo', onPress: () => {} } })}
      >
        Delete payee
      </Button>
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        title="Block your card?"
        actions={
          <>
            <Button variant="ghost" onPress={() => setDialog(false)}>
              Cancel
            </Button>
            <Button
              onPress={() => {
                setDialog(false);
                snackbar.show('Card blocked');
              }}
            >
              Block card
            </Button>
          </>
        }
      >
        Payments and withdrawals stop right away.
      </Dialog>
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Pay from">
        {['Savings •• 4821', 'Salary •• 1034'].map((name) => (
          <Button key={name} fullWidth variant="secondary" onPress={() => setSheet(false)}>
            {name}
          </Button>
        ))}
      </BottomSheet>
    </Section>
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
      <SnackbarProvider>
        <ScrollView
          style={{ backgroundColor: themes[scheme].colors.background }}
          contentContainerStyle={styles.content}
        >
          <Text style={[styles.title, { color: themes[scheme].colors.text }]}>Tandem UI</Text>
          <Text style={[styles.subtitle, { color: themes[scheme].colors.textMuted }]}>
            Same components and tokens as the web, rendered with React Native.
          </Text>

          <Stagger>
            <BankCard last4="4821" holder="Shivastu Shrivastava" expiry="08/29" finish="midnight" />
            <View style={styles.backdrop}>
              <View style={[styles.blob, { backgroundColor: palette.red[300], top: -30, left: -20 }]} />
              <View style={[styles.blob, { backgroundColor: palette.brand[500], top: 10, right: -30 }]} />
              <View style={[styles.blob, { backgroundColor: palette.green[300], bottom: -40, left: 90 }]} />
              <Surface variant="glass" padding="xl" radius="xl">
                <Text style={[styles.label, { color: themes[scheme].colors.textMuted }]}>Card balance</Text>
                <RollingAmount value={24580} size="lg" />
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

            <View style={styles.form}>
              <Text style={[styles.label, { color: themes[scheme].colors.textMuted }]}>Inputs</Text>
              <SearchField label="Search transactions" placeholder="Search merchants or UPI IDs" />
              <TextField label="Full name" placeholder="As on your PAN card" helperText="We use this on your card" />
              <PhoneField label="Mobile number" />
              <AmountField label="Amount" helperText="Max ₹ 50,00,000 per day" />
              <AccountNumberField label="Account number" />
              <OtpField label="Enter OTP" />
              <TextField label="Glass field" variant="glass" placeholder="Over the backdrop" />
            </View>

            <View style={styles.form}>
              <Text style={[styles.label, { color: themes[scheme].colors.textMuted }]}>AutoForm</Text>
              <AutoForm
                fields={addPayee}
                submitLabel="Add payee"
                onSubmit={async (values) => {
                  await new Promise((resolve) => setTimeout(resolve, 800));
                  console.log(values);
                }}
              />
            </View>

            <Overlays />

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
          </Stagger>
        </ScrollView>
      </SnackbarProvider>
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
  form: { gap: space.lg },
  backdrop: { padding: space.xl, borderRadius: foundations.radius.xl, overflow: 'hidden' },
  blob: { position: 'absolute', width: 160, height: 160, borderRadius: 80, opacity: 0.9 },
});
