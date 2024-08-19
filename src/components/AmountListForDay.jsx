import React, { useEffect, useState } from 'react';
import axios from "axios";

function AmountListForDay({ day }) {
    const [orderList, setOrderList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:9999/api/board/list2", {
                params: { regdate: day },
            })
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setOrderList(response.data);
                } else {
                    console.error("Unexpected response format:", response.data);
                    setError("Unexpected response format");
                }
            })
            .catch((error) => {
                console.error("Failed to fetch data:", error);
                setError("Failed to fetch data");
            });
    }, [day]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>{day}</h1>
            <ul>
                {orderList.length > 0 ? (
                    orderList.map((item, index) => (
                        <li key={index}>{item.title}</li>
                    ))
                ) : (
                    <li>No data available for this date.</li>
                )}
            </ul>
        </div>
    );
}

export default AmountListForDay;
