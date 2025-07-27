import { Product } from '@/types/product';
import ProductCard from '@/components/common/product/ProductCard';
import EventCard from './EventCard';

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  peermallId: number;
  discount: number;
  badge: string;
}

interface IntegratedGridViewProps {
  products: Product[];
  events: Event[];
}

const IntegratedGridView = ({ products, events }: IntegratedGridViewProps) => {
  // 상품 3개당 이벤트 1개를 삽입하는 로직
  const integratedItems = [];
  let productIndex = 0;
  let eventIndex = 0;

  while (productIndex < products.length || eventIndex < events.length) {
    // 상품 3개 추가
    for (let i = 0; i < 3 && productIndex < products.length; i++) {
      integratedItems.push({
        type: 'product',
        data: products[productIndex],
        key: `product-${products[productIndex].id}`
      });
      productIndex++;
    }

    // 이벤트 1개 추가 (있을 경우)
    if (eventIndex < events.length) {
      integratedItems.push({
        type: 'event',
        data: events[eventIndex],
        key: `event-${events[eventIndex].id}`
      });
      eventIndex++;
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {integratedItems.map((item) => (
        <div key={item.key} className={item.type === 'event' ? 'sm:col-span-2' : 'col-span-1'}>
          {item.type === 'product' ? (
            <ProductCard product={item.data} />
          ) : (
            <EventCard event={item.data} />
          )}
        </div>
      ))}
    </div>
  );
};

export default IntegratedGridView;