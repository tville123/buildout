import { View, Text } from 'react-native';
import s from '../styles';

interface ShoppingItem {
  name: string;
  sub?: string;
  qty: string;
}

interface Props {
  items: ShoppingItem[];
}

export default function ShoppingList({ items }: Props) {
  return (
    <View style={s.shoppingCard}>
      <Text style={s.shoppingTitle}>Shopping List</Text>
      {items.map((item, i) => (
        <View key={i} style={[s.shopItem, i === items.length - 1 && { borderBottomWidth: 0 }]}>
          <View style={{ flex: 1 }}>
            <Text style={s.shopName}>{item.name}</Text>
            {item.sub ? <Text style={s.shopSub}>{item.sub}</Text> : null}
          </View>
          <Text style={s.shopQty}>{item.qty}</Text>
        </View>
      ))}
    </View>
  );
}
