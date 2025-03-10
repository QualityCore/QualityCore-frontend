import React from "react";
import { FaFastBackward, FaAngleLeft, FaAngleRight, FaFastForward } from 'react-icons/fa'; // react-icons에서 아이콘 임포트
import pagination from "./Pagination.module.css";

const Pagination = ({ page, totalPages, first, last, onPageChange }) => {
    console.log("Pagination 컴포넌트 렌더링, 현재 페이지:", page);

    const handlePageChange = (newPage) => {
        console.log("페이지 변경: ", newPage);
        if (newPage >= 0 && newPage < totalPages) {
            onPageChange(newPage); // 페이지 변경 함수 호출
        }
    };

    return (
        <div className={pagination.paging}>
            <button
                onClick={() => handlePageChange(0)}
                disabled={first || totalPages === 0}
                className={pagination.button}
            >
                <FaFastBackward size={10} /> {/* << 아이콘 */}
            </button>
            <button
                onClick={() => handlePageChange(page - 1)}
                disabled={first || totalPages === 0}
                className={pagination.button}
            >
                <FaAngleLeft size={10} /> {/* < 아이콘 */}
            </button>
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => handlePageChange(index)}
                    disabled={page === index}
                    className={`${pagination.button} ${page === index ? pagination.active : ""}`}
                >
                    {index + 1}
                </button>
            ))}
            <button
                onClick={() => handlePageChange(page + 1)}
                disabled={last || totalPages === 0}
                className={pagination.button}
            >
                <FaAngleRight size={10} /> {/* > 아이콘 */}
            </button>
            <button
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={last || totalPages === 0}
                className={pagination.button}
            >
                <FaFastForward size={10} /> {/* >> 아이콘 */}
            </button>
        </div>
    );
};

export default Pagination;
