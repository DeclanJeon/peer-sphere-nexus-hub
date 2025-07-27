import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SellerLink } from '@/types/product';
import { Truck } from 'lucide-react';

interface SellerLinksProps {
  links: SellerLink[];
}

const SellerLinks = ({ links }: SellerLinksProps) => {
  if (!links || links.length === 0) {
    return null;
  }

  // 가장 저렴한 가격을 찾아 최저가로 설정
  const lowestPriceLink = [...links].sort((a, b) => a.price - b.price)[0];

  return (
    <Card className="mt-6 border-2 border-red-100 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">쇼핑몰별 최저가</CardTitle>
        <div className="text-right">
          <span className="text-sm text-muted-foreground">최저가</span>
          <p className="text-2xl font-bold text-red-600">{lowestPriceLink.price.toLocaleString()}원</p>
        </div>
      </CardHeader>
      <CardContent>
        <Separator className="my-4" />
        <div className="space-y-3">
          {links.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img src={item.logoUrl} alt={item.name} className="h-6 w-auto object-contain" />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="font-bold text-foreground">{item.price.toLocaleString()}원</span>
                <span className="text-muted-foreground w-20 text-center">{item.shippingInfo}</span>
                <span className="text-muted-foreground w-24 text-right hidden md:block">{item.updateInfo}</span>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button asChild variant="destructive" className="w-full md:w-auto">
            <a href={lowestPriceLink.link} target="_blank" rel="noopener noreferrer">
              최저가 구매하기
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerLinks;