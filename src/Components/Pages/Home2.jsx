import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home2() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const apiData = await axios.get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        console.log(apiData.data);
        setRows(apiData.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    getData();
  }, []);

  const handleDelete = (id) => {
    const updatedItems = rows.filter((item) => item.id !== id);
    console.log("updatedItems", updatedItems);
    setRows(updatedItems);
  };

  return (
    <div>
      <ul>
        {rows.map((item) => (
          <li key={item.id}>
            {item.name}
            <button className='ms-3' onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home2;
