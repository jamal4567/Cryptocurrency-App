import "./App.css";
import Axios from "axios";
import { useEffect, useState } from "react";
import React from "react";

function App() {
  const [search, setSearch] = useState("");
  const [crypto, setCrypto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(
          "https://openapiv1.coinstats.app/coins",
          {
            headers: {
              "X-API-KEY": process.env.REACT_APP_COINSTATS_API_KEY,
            },
          }
        );
        
        if (response.data && response.data.result) {
          setCrypto(response.data.result);
        } else {
          setError("No data received from API");
        }
      } catch (err) {
        setError("Error fetching cryptocurrency data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <h1>All Cryptocurrencies</h1>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <table>
        <thead>
          <tr>
            <td>Rank</td>
            <td>Name</td>
            <td>Symbol</td>
            <td>Market Cap</td>
            <td>Price</td>
            <td>Available Supply</td>
            <td>Volume(24hrs)</td>
          </tr>
        </thead>
        <tbody>
          {crypto
            .filter((val) =>
              val.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((val) => {
              return (
                <tr key={val.id}>
                  <td className="rank">{val.rank}</td>
                  <td className="logo">
                    <a href={val.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <img src={val.icon} alt={`${val.name} logo`} width="30px" />
                    </a>
                    <p>{val.name}</p>
                  </td>
                  <td className="symbol">{val.symbol}</td>
                  <td>${new Intl.NumberFormat().format(val.marketCap)}</td>
                  <td>${val.price.toFixed(2)}</td>
                  <td>{new Intl.NumberFormat().format(val.availableSupply)}</td>
                  <td>{new Intl.NumberFormat().format(val.volume)}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
