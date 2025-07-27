import { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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

interface SplitViewProps {
  products: Product[];
  events: Event[];
}

const SplitView = ({ products, events }: SplitViewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 왼쪽: 이벤트 슬라이더 (2/3) */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">진행중인 이벤트</CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full">
              <CarouselContent>
                {events.map((event) => (
                  <CarouselItem key={event.id}>
                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* EVENT 배지 */}
                      <Badge 
                        className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white font-bold"
                      >
                        EVENT
                      </Badge>

                      {/* 할인율 배지 */}
                      {event.discount > 0 && (
                        <Badge 
                          className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 text-white font-bold"
                        >
                          {event.discount}% OFF
                        </Badge>
                      )}

                      {/* 컨텐츠 */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">
                          {event.title}
                        </h3>
                        <p className="text-white/90 mb-4">
                          {event.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                            {event.badge}
                          </Badge>
                          <span className="text-sm text-white/80">
                            {new Date(event.endDate).toLocaleDateString()} 까지
                          </span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </div>

      {/* 오른쪽: 상품 목록 (1/3) */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">상품 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 8).map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.images?.[0] || '/placeholder.png'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                      {product.name}
                    </h4>
                    <p className="text-primary font-bold text-sm">
                      {product.price?.toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SplitView;