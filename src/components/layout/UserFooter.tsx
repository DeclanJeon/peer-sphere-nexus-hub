import { Home } from 'lucide-react'; // ✨ 홈 아이콘을 위한 import 추가

const UserFooter = ({ currentPeermall }: { currentPeermall: any }) => {
    return (
      <footer className="bg-gray-100 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 피어몰 정보 */}
            <div className="space-y-4">
              <a href={`/home/${currentPeermall.url}`} className="text-2xl font-bold text-primary">
                {currentPeermall.name}
              </a>
              <p className="text-sm text-gray-600">
                세상을 넓히는 연결의 시작,<br />
                {currentPeermall.name}과 함께 하세요.
              </p>
            </div>

            {/* 사업자 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">사업자 정보</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>피어테라㈜ | 대표이사: 김기환</p>
                <p>선유로13길 25, 에이스하이테크시티2 408호</p>
                <p>사업자 등록번호: 110-00-00000</p>
                <p>통신판매업신고: 2017-서울송파-0680</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">대표 이메일</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>info@peermall.com</p>
              </div>
            </div>
          </div>
          
          {/* ✨ [새로운 추가] 메인 홈으로 돌아가기 버튼 */}
          <div className="mt-8 flex justify-end">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">메인 홈으로 돌아가기</span>
            </a>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              &copy; 2025 {currentPeermall.name} All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    )
}

export default UserFooter