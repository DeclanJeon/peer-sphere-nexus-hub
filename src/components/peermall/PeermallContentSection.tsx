import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PeermallContentSection = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="space-y-12">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">판매 상품</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                등록된 상품이 없습니다.
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">커뮤니티</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                작성된 게시글이 없습니다.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PeermallContentSection;