import React from "react";
import pagination from "./Pagination.module.css";

const Pagination = ({ page, totalPages, first, last, onPageChange }) => {
    return (
        <div className={pagination.paging}>
            <button
                onClick={() => onPageChange(0)}
                disabled={first}
                className={pagination.button}
            >
                {"<<"}
            </button>
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={first}
                className={pagination.button}
            >
                {"<"}
            </button>
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => onPageChange(index)}
                    disabled={page === index}
                    className={`${pagination.button} ${page === index ? pagination.active : ""}`}
                >
                    {index + 1}
                </button>
            ))}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={last}
                className={pagination.button}
            >
                {">"}
            </button>
            <button
                onClick={() => onPageChange(totalPages - 1)}
                disabled={last}
                className={pagination.button}
            >
                {">>"}
            </button>
        </div>
    );
};

export default Pagination;
