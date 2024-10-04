import { useEffect } from 'react';
import PropTypes from 'prop-types';
const InfoBox = ({ title, content, showInfo, onClose }) => {
  // Tự động ẩn sau 1.5s nếu cần
  useEffect(() => {
    if (showInfo) {
      const timer = setTimeout(() => {
        onClose(); // Gọi hàm onClose khi hết thời gian
      }, 1200); // 1.5 giây
      return () => clearTimeout(timer); // Cleanup
    }
  }, [showInfo, onClose]);

  if (!showInfo) return null; // Không hiển thị nếu showInfo là false

  return (
    <div
      className="absolute right-0 mt-1 p-3 w-64 bg-gray-100 border border-gray-300 rounded-md shadow-lg"
      style={{ zIndex: 10, top: '30px' }}
    >
      <div>
        <h1 className='text-black'>{title}</h1>
        <p className="text-sm text-gray-700">
          {content}
        </p>
      </div>
    </div>
  );
};
InfoBox.propTypes = {
    title: PropTypes.string.isRequired, // 'title' bắt buộc phải là chuỗi
    content: PropTypes.string.isRequired, // 'content' bắt buộc phải là chuỗi
    showInfo: PropTypes.bool.isRequired, // 'showInfo' bắt buộc phải là boolean
    onClose: PropTypes.func.isRequired, // 'onClose' bắt buộc phải là hàm
  };
export default InfoBox;
