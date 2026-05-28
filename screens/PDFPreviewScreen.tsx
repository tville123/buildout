import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { QuoteStackParamList } from '../App';
import { useQuote } from '../context/QuoteContext';
import TopBar from '../components/TopBar';
import { C } from '../theme';
import type { Quote } from '../types';
import { formatMoney as money } from '../utils/format';

type Props = NativeStackScreenProps<QuoteStackParamList, 'PDFPreview'>;

function buildHTML(quote: Quote): string {
  const subtotal = quote.lineItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const tax = subtotal * (quote.taxRate / 100);
  const grand = subtotal + tax;
  const rows = quote.lineItems.map(i => `
    <tr>
      <td>${i.description}</td>
      <td style="text-align:right">${i.quantity}</td>
      <td style="text-align:right">${money(i.unitPrice)}</td>
      <td style="text-align:right">${money(i.quantity * i.unitPrice)}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <style>
    body { font-family: -apple-system, Helvetica, sans-serif; background: #f4f1ea; color: #1a1a1a; padding: 32px; }
    h1 { font-size: 28px; letter-spacing: 2px; margin: 0; }
    .period { color: #f5c842; }
    .head { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .meta { font-size: 9px; font-family: monospace; color: #555; text-align: right; line-height: 1.8; }
    hr { border: 0; border-top: 1px solid #d0cdc5; margin: 16px 0; }
    .label { font-size: 8px; text-transform: uppercase; letter-spacing: 1.4px; color: #999; margin-bottom: 4px; }
    .client { font-size: 18px; font-weight: 600; }
    .job { font-size: 11px; color: #555; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { font-size: 8px; text-transform: uppercase; letter-spacing: 1.2px; padding: 6px 4px; border-bottom: 1px solid #ccc; text-align: left; }
    td { font-size: 10px; padding: 8px 4px; border-bottom: 1px solid #e8e4dc; }
    .totals { margin-top: 20px; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .t-row { display: flex; gap: 40px; font-size: 10px; }
    .t-grand { font-size: 20px; font-weight: 700; color: #1a1a1a; }
    .foot { margin-top: 40px; font-size: 9px; color: #888; line-height: 1.6; }
  </style>
  </head><body>
  <div class="head">
    <div>
      <h1>BUILDOUT<span class="period">.</span></h1>
      <div style="font-size:10px;color:#888;margin-top:4px">Drafthouse Trade Co. · (415) 555-0188</div>
    </div>
    <div class="meta">QUOTE #BO-${quote.id.slice(-4).toUpperCase()}<br>${new Date(quote.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}<br>Valid 30 days</div>
  </div>
  <hr/>
  <div class="label">Prepared for</div>
  <div class="client">${quote.clientName || 'Client'}</div>
  <div class="job">${quote.jobDescription || ''}</div>
  <table>
    <thead><tr><th>Item</th><th style="text-align:right">Qty</th><th style="text-align:right">Unit</th><th style="text-align:right">Total</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="totals">
    <div class="t-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
    <div class="t-row"><span>Tax (${quote.taxRate.toFixed(2)}%)</span><span>${money(tax)}</span></div>
    <div class="t-row t-grand"><span>Total Due</span><span>${money(grand)}</span></div>
  </div>
  <div class="foot">Material estimates include 10% waste. Final invoice may vary based on site conditions.</div>
  </body></html>`;
}

export default function PDFPreviewScreen({ navigation, route }: Props) {
  const { quoteId } = route.params;
  const { getQuote } = useQuote();
  const quote = getQuote(quoteId);

  if (!quote) {
    return (
      <View style={styles.container}>
        <TopBar tag="PDF Preview" onBack={() => navigation.goBack()} actions={[]} />
        <View style={styles.error}>
          <Text style={styles.errorText}>Quote not found.</Text>
        </View>
      </View>
    );
  }

  const subtotal = quote.lineItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const tax = subtotal * (quote.taxRate / 100);
  const grand = subtotal + tax;

  const handleShare = async () => {
    try {
      const html = buildHTML(quote);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
      } else {
        Alert.alert('Sharing not available on this device.');
      }
    } catch (e) {
      Alert.alert('Error generating PDF', String(e));
    }
  };

  return (
    <View style={styles.container}>
      <TopBar tag="PDF Preview" onBack={() => navigation.goBack()} actions={['share']} onActionPress={() => handleShare()} />
      <ScrollView style={styles.stage} contentContainerStyle={styles.stageContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View style={styles.pageHead}>
            <View>
              <Text style={styles.brand}>BUILDOUT<Text style={{ color: C.yellow }}>.</Text></Text>
              <Text style={styles.brandSub}>Drafthouse Trade Co. · (415) 555-0188</Text>
            </View>
            <View style={styles.pageMeta}>
              <Text style={styles.pageMetaText}>QUOTE #BO-{quote.id.slice(-4).toUpperCase()}</Text>
              <Text style={styles.pageMetaText}>{new Date(quote.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
              <Text style={styles.pageMetaText}>Valid 30 days</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.pageLabel}>Prepared for</Text>
          <Text style={styles.pageClient}>{quote.clientName || 'Client'}</Text>
          <Text style={styles.pageJob}>{quote.jobDescription}</Text>

          <View style={styles.tableHead}>
            {['Item', 'Qty', 'Unit', 'Total'].map((h, i) => (
              <Text key={h} style={[styles.tableHeadCell, i > 0 && styles.tableHeadCellR]}>{h}</Text>
            ))}
          </View>
          {quote.lineItems.map(item => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCell} numberOfLines={1}>{item.description}</Text>
              <Text style={[styles.tableCell, styles.tableCellR]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.tableCellR]}>{money(item.unitPrice)}</Text>
              <Text style={[styles.tableCell, styles.tableCellR]}>{money(item.quantity * item.unitPrice)}</Text>
            </View>
          ))}

          <View style={styles.pdfTotals}>
            <View style={styles.pdfTotalsRow}>
              <Text style={styles.pdfTotalsLabel}>Subtotal</Text>
              <Text style={styles.pdfTotalsVal}>{money(subtotal)}</Text>
            </View>
            <View style={styles.pdfTotalsRow}>
              <Text style={styles.pdfTotalsLabel}>Tax ({quote.taxRate.toFixed(2)}%)</Text>
              <Text style={styles.pdfTotalsVal}>{money(tax)}</Text>
            </View>
            <View style={[styles.pdfTotalsRow, styles.pdfTotalsGrand]}>
              <Text style={styles.pdfTotalsLabelBold}>Total Due</Text>
              <Text style={styles.pdfTotalsGrandVal}>{money(grand)}</Text>
            </View>
          </View>

          <Text style={styles.pageFooter}>Material estimates include 10% waste. Final invoice may vary based on site conditions.</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
        <View>
          <Text style={styles.shareEyebrow}>Ready</Text>
          <Text style={styles.shareLabel}>Share PDF</Text>
        </View>
        <Ionicons name="share-outline" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 14,
    color: C.textMid,
  },
  stage: {
    flex: 1,
    backgroundColor: '#cac6bc',
  },
  stageContent: {
    padding: 16,
    paddingBottom: 100,
    alignItems: 'center',
  },
  page: {
    backgroundColor: '#f4f1ea',
    borderRadius: 4,
    padding: 28,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  pageHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  brand: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
    color: '#1a1a1a',
    letterSpacing: 1,
  },
  brandSub: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 9,
    color: '#888',
    marginTop: 2,
  },
  pageMeta: {
    alignItems: 'flex-end',
    gap: 2,
  },
  pageMetaText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 8.5,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#d0cdc5',
    marginBottom: 14,
  },
  pageLabel: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 8,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#999',
    marginBottom: 4,
  },
  pageClient: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 16,
    color: '#1a1a1a',
  },
  pageJob: {
    fontFamily: 'IBMPlexSans_300Light',
    fontSize: 10.5,
    color: '#555',
    marginTop: 2,
    marginBottom: 14,
  },
  tableHead: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 6,
    marginBottom: 2,
  },
  tableHeadCell: {
    flex: 2,
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 7.5,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#888',
  },
  tableHeadCellR: {
    flex: 1,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e4dc',
  },
  tableCell: {
    flex: 2,
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 9.5,
    color: '#1a1a1a',
  },
  tableCellR: {
    flex: 1,
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    textAlign: 'right',
    color: '#333',
  },
  pdfTotals: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#d0cdc5',
    paddingTop: 12,
    gap: 6,
    alignItems: 'flex-end',
  },
  pdfTotalsRow: {
    flexDirection: 'row',
    gap: 32,
    alignItems: 'center',
  },
  pdfTotalsLabel: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 10,
    color: '#555',
  },
  pdfTotalsLabelBold: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 11,
    color: '#1a1a1a',
  },
  pdfTotalsVal: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    color: '#1a1a1a',
    minWidth: 80,
    textAlign: 'right',
  },
  pdfTotalsGrand: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#d0cdc5',
  },
  pdfTotalsGrandVal: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
    color: '#1a1a1a',
    letterSpacing: 0.5,
    minWidth: 80,
    textAlign: 'right',
  },
  pageFooter: {
    marginTop: 28,
    fontFamily: 'IBMPlexSans_300Light',
    fontSize: 8.5,
    color: '#888',
    lineHeight: 14,
  },
  shareBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.yellow,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareEyebrow: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 9.6,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.5)',
  },
  shareLabel: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 15,
    color: '#000',
  },
});
