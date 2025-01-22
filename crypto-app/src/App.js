import "./App.css";
import Axios from "axios";
import { useEffect, useState, useCallback, memo } from "react";

// Memoized CryptoRow component for better performance
const CryptoRow = memo(({ val }) => (
  <tr key={val.id}>
    <td className="rank">{val.rank}</td>
    <td className="logo">
      <a href={val.websiteUrl} target="_blank" rel="noopener noreferrer">
        <img src={val.icon} alt={`${val.name} logo`} loading="lazy" />
      </a>
      <p>{val.name}</p>
    </td>
    <td className="symbol">{val.symbol}</td>
    <td>${new Intl.NumberFormat().format(val.marketCap)}</td>
    <td>${val.price.toFixed(2)}</td>
    <td>{new Intl.NumberFormat().format(val.availableSupply)}</td>
    <td>{new Intl.NumberFormat().format(val.volume)}</td>
  </tr>
));

function App() {
  const [search, setSearch] = useState("");
  const [crypto, setCrypto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized search handler
  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  // Memoized filter function
  const filteredCrypto = useCallback(
    () => crypto.filter((val) => 
      val.name.toLowerCase().includes(search.toLowerCase())
    ),
    [crypto, search]
  );

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(
          "https://openapiv1.coinstats.app/coins",
          {
            headers: {
              "X-API-KEY": process.env.REACT_APP_COINSTATS_API_KEY,
            },
            signal: controller.signal
          }
        );
        
        if (response.data && response.data.result) {
          setCrypto(response.data.result);
        } else {
          setError("No data received from API");
        }
      } catch (err) {
        if (!Axios.isCancel(err)) {
          setError("Error fetching cryptocurrency data");
          console.error("Error fetching data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="App">
      <h1>All Cryptocurrencies</h1>
      <input
        type="text"
        placeholder="Search..."
        onChange={handleSearch}
        value={search}
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
          {filteredCrypto().map((val) => (
            <CryptoRow key={val.id} val={val} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
