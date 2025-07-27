const Footer = () => {
    return (
        <footer className="bg-gray-100 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 피어몰 정보 */}
            <div className="space-y-4">
              <a href="/" className="text-2xl font-bold text-primary">
                피어몰
              </a>
              <p className="text-sm text-gray-600">
                세상을 넓히는 연결의 시작,<br />
                피어몰과 함께 하세요.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">대표 이메일</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>info@peermall.com</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              &copy; 2025 피어테라(주). All rights reserved.
            </p>
          </div>
        </div>
        </footer>
    )
}

export default Footer;