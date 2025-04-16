import React from 'react'
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="bg-[#1C2930] text-white/75">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Cột 1: Giới thiệu */}
          <div>
            <h2 className="font-bold text-lg mb-3 text-white">Về Travel</h2>
            <p className="text-sm ">
              Travel là nền tảng du lịch hàng đầu giúp bạn đặt tour, đặt vé máy bay, khách sạn và các dịch vụ khác một cách dễ dàng.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h2 className="font-bold text-lg mb-3 text-white">Liên kết</h2>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary">Về chúng tôi</Link></li>
              <li><Link href="#" className="hover:text-primary">Liên hệ</Link></li>
              <li><Link href="#" className="hover:text-primary">Điều khoản</Link></li>
              <li><Link href="#" className="hover:text-primary">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h2 className="font-bold text-lg mb-3 text-white">Hỗ trợ</h2>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary">Câu hỏi thường gặp</Link></li>
              <li><Link href="#" className="hover:text-primary">Trung tâm hỗ trợ</Link></li>
              <li><Link href="#" className="hover:text-primary">Chính sách hoàn tiền</Link></li>
            </ul>
          </div>

          {/* Cột 4: Mạng xã hội */}
          <div>
            <h2 className="font-bold text-lg mb-3 text-white">Theo dõi chúng tôi</h2>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600"><FaFacebookF size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-blue-400"><FaTwitter size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-pink-600"><FaInstagram size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-red-600"><FaYoutube size={20} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#1C2930] text-center py-4 text-sm">
        © {new Date().getFullYear()} Traveloka. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer